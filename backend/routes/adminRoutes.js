
import express from 'express';

import {
  getUsers,
  updateUserStatus,
  deleteUser,
} from '../controllers/adminController.js';

import {
  getAdminContacts,
  deleteContact,
  updateContactStatus,
} from '../controllers/contactController.js';

import {
  getDiwaliMemories,
  createDiwaliMemory,
  deleteDiwaliMemory,
} from '../controllers/diwaliController.js';

import adminAuth from '../middleware/adminAuth.js';
import cloudinaryUpload from '../middleware/cloudinaryUpload.js';

const router = express.Router();

// Protect all admin routes
router.use(adminAuth);

// USER MANAGEMENT
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// CONTACT MANAGEMENT
router.get('/contacts', getAdminContacts);
router.patch('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

// DIWALI MEMORIES
router.get('/diwali', getDiwaliMemories);

router.post(
  '/diwali',
  cloudinaryUpload.array('media', 20),
  createDiwaliMemory
);

router.delete('/diwali/:id', deleteDiwaliMemory);

export default router;
