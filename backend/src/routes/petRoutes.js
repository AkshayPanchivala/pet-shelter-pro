import { Router } from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
} from '../controllers/petController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 */
router.get('/', getAllPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get pet by ID
 *     tags: [Pets]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getPetById);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Create a new pet (Admin only)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - age
 *               - description
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Max
 *               species:
 *                 type: string
 *                 example: Dog
 *               breed:
 *                 type: string
 *                 example: Golden Retriever
 *               age:
 *                 type: number
 *                 example: 3
 *               description:
 *                 type: string
 *                 example: Friendly and playful dog
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *               status:
 *                 type: string
 *                 enum: [Available, Pending, Adopted]
 *                 default: Available
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticate, authorize('admin'), createPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Update pet details (Admin only)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               status:
 *                 type: string
 *                 enum: [Available, Pending, Adopted]
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticate, authorize('admin'), updatePet);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Delete a pet (Admin only)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pet deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, authorize('admin'), deletePet);

export default router;
