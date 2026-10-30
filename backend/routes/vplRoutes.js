
import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';
import { vplQRUpload } from '../middleware/cloudinaryUpload.js';

import {
  registerPlayer,
  getPaymentQR,
  getVPLRegistrations,
  getAdminPaymentQR,
  uploadPaymentQR,
  updateVPLPaymentStatus,
  deleteVPLRegistration
} from '../controllers/vplController.js';

const router = express.Router();

// USER ROUTES
router.get('/payment-qr', authMiddleware, getPaymentQR);
router.post('/register', authMiddleware, registerPlayer);

// ADMIN ROUTES
router.use('/admin', adminAuth);

router.get('/admin/registrations', getVPLRegistrations);

router.delete(
  '/admin/registrations/:id',
  deleteVPLRegistration
);

router.get('/admin/payment-qr', getAdminPaymentQR);

// Upload or replace payment QR
router.post(
  '/admin/payment-qr',
  (req, res, next) => {
    vplQRUpload.single('qrCode')(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.code === 'LIMIT_FILE_SIZE'
            ? 'QR code image must be 5 MB or smaller.'
            : error.message
        });
      }

      next();
    });
  },
  uploadPaymentQR
);

router.patch(
  '/admin/registrations/:id/payment',
  updateVPLPaymentStatus
);

export default router;
