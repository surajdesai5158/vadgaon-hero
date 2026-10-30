
import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import cloudinaryUpload from '../middleware/cloudinaryUpload.js';

import {
  getCricketMemories,
  createCricketMemory,
  deleteCricketMemory
} from '../controllers/cricketController.js';

const router = express.Router();

// PUBLIC ROUTE
// Users can only view Cricket Memories.
router.get('/', getCricketMemories);

// ADMIN ROUTES
// Only approved administrators can add or delete memories.

// Add a new season with multiple photos.
router.post(
  '/admin',
  adminAuth,
  cloudinaryUpload.array('photos', 20),
  createCricketMemory
);

// Delete a season and its Cloudinary photos.
router.delete(
  '/admin/:id',
  adminAuth,
  deleteCricketMemory
);

export default router;
