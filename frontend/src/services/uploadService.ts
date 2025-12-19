import api from './api';

export interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

// Get upload signature from backend
export const getUploadSignature = async (): Promise<UploadSignature> => {
  const response = await api.get('/upload/signature');
  return response.data;
};

// Upload image to Cloudinary via backend
export const uploadImage = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  await api.delete('/upload/image', {
    data: { publicId },
  });
};

// Upload image directly to Cloudinary (client-side)
export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; publicId: string }> => {
  try {
    // Get signature from backend
    const signatureData = await getUploadSignature();

    // Create form data for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', cloudinaryUrl);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Upload to Cloudinary error:', error);
    throw error;
  }
};
