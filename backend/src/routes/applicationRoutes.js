import { Router } from 'express';
import {
  getAllApplications,
  getUserApplications,
  getPetApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authenticate, authorize('admin'), getAllApplications);

/**
 * @swagger
 * /api/applications/my:
 *   get:
 *     summary: Get current user's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticate, getUserApplications);

/**
 * @swagger
 * /api/applications/pet/{petId}:
 *   get:
 *     summary: Get all applications for a specific pet (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: List of applications for the pet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/pet/:petId', authenticate, authorize('admin'), getPetApplications);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a new adoption application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - message
 *             properties:
 *               petId:
 *                 type: string
 *                 description: ID of the pet to adopt
 *               message:
 *                 type: string
 *                 description: Application message explaining why you want to adopt
 *                 example: I would love to adopt this pet because...
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Validation error or duplicate application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 */
router.post('/', authenticate, createApplication);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *                 description: New application status
 *     responses:
 *       200:
 *         description: Application status updated successfully. Emails sent to applicants.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Application not found
 */
router.patch('/:id/status', authenticate, authorize('admin'), updateApplicationStatus);

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.delete('/:id', authenticate, deleteApplication);

export default router;
