
import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';
import cloudinaryUpload from '../middleware/cloudinaryUpload.js';

import {
  getVillageImprovements,
  createVillageImprovement,
  deleteVillageImprovement
} from '../controllers/villageImprovementController.js';

const router = express.Router();

// Approved users and admins can view records
router.get('/', authMiddleware, getVillageImprovements);

// Only approved admins can add records
router.post(
  '/',
  adminAuth,
  cloudinaryUpload.array('media', 20),
  createVillageImprovement
);

// Only approved admins can delete records
router.delete('/:id', adminAuth, deleteVillageImprovement);

export default router;
