import express from 'express';
import multer from 'multer';
import { getUploadSignature, uploadImage, deleteImage } from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @swagger
 * /api/upload/signature:
 *   get:
 *     summary: Get Cloudinary upload signature for client-side upload (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upload signature generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signature:
 *                   type: string
 *                   description: Cloudinary upload signature
 *                 timestamp:
 *                   type: number
 *                   description: Signature timestamp
 *                 cloudName:
 *                   type: string
 *                   description: Cloudinary cloud name
 *                 apiKey:
 *                   type: string
 *                   description: Cloudinary API key
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/signature', authenticate, authorize('admin'), getUploadSignature);

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload image to Cloudinary via server (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (max 5MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: Cloudinary image URL
 *                 publicId:
 *                   type: string
 *                   description: Cloudinary public ID
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/image', authenticate, authorize('admin'), upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/upload/image:
 *   delete:
 *     summary: Delete image from Cloudinary (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicId
 *             properties:
 *               publicId:
 *                 type: string
 *                 description: Cloudinary public ID of the image to delete
 *                 example: pet-adoption/abc123xyz
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *       400:
 *         description: Public ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/image', authenticate, authorize('admin'), deleteImage);

export default router;
