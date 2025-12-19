import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadImage } from '../services/uploadService';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary via backend
      const result = await uploadImage(file);

      onChange(result.url);
      setPreviewUrl(result.url);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(value);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full h-48 object-cover rounded-md border-2 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
              <div className="text-white text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Uploading... {uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center space-y-2 transition-colors ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isUploading ? (
            <>
              <Loader className="h-12 w-12 text-emerald-600 animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </>
          )}
        </button>
      )}

      {/* URL Input as fallback */}
      
    </div>
  );
}
