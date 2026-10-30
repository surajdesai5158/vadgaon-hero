
import mongoose from 'mongoose';

import VPLRegistration from '../models/VPLRegistration.js';
import VPLPaymentQR from '../models/VPLPaymentQR.js';

import {
  uploadBufferToCloudinary,
  deleteCloudinaryAsset
} from '../middleware/cloudinaryUpload.js';

// Register a player (approved user)
export const registerPlayer = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const age = Number(req.body.age);
    const position = String(req.body.position || '');
    const paymentMethod = String(req.body.paymentMethod || '');

    if (!name || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid player name.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address.'
      });
    }

    if (!Number.isInteger(age) || age < 10 || age > 100) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid age between 10 and 100.'
      });
    }

    const validPositions = [
      'Batsman',
      'Bowler',
      'Wicket Keeper',
      'All-Rounder'
    ];

    if (!validPositions.includes(position)) {
      return res.status(400).json({
        success: false,
        message: 'Select a valid cricket position.'
      });
    }

    if (!['Cash', 'Online'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Select a valid payment method.'
      });
    }

    const userId = req.user._id;

    const existingRegistration = await VPLRegistration.findOne({
      user: userId
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a VPL registration.'
      });
    }

    const registration = await VPLRegistration.create({
      user: userId,
      name,
      email,
      age,
      position,
      paymentMethod,
      paymentStatus: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Your VPL registration was submitted successfully!',
      registration: {
        id: registration._id,
        name: registration.name,
        email: registration.email,
        age: registration.age,
        position: registration.position,
        paymentMethod: registration.paymentMethod,
        paymentStatus: registration.paymentStatus
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a VPL registration.'
      });
    }

    console.error('VPL registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit VPL registration.'
    });
  }
};

// Get the currently active QR code (approved users)
export const getPaymentQR = async (req, res) => {
  try {
    const qr = await VPLPaymentQR.findOne()
      .sort({ updatedAt: -1 })
      .select('imageUrl updatedAt');

    return res.status(200).json({
      success: true,
      qrCode: qr?.imageUrl || ''
    });
  } catch (error) {
    console.error('Get VPL QR error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load the payment QR code.'
    });
  }
};

// Admin: list all registrations
export const getVPLRegistrations = async (req, res) => {
  try {
    const registrations = await VPLRegistration.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    return res.status(200).json({
      success: true,
      registrations
    });
  } catch (error) {
    console.error('Get VPL registrations error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load VPL registrations.'
    });
  }
};

// Admin: delete one VPL registration only
export const deleteVPLRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid VPL registration ID.'
      });
    }

    const registration = await VPLRegistration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'VPL registration not found. It may already be deleted.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `VPL registration for ${registration.name} deleted successfully.`,
      deletedRegistrationId: id
    });
  } catch (error) {
    console.error('Delete VPL registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete VPL registration.'
    });
  }
};

// Admin: get QR code details
export const getAdminPaymentQR = async (req, res) => {
  try {
    const qr = await VPLPaymentQR.findOne()
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      qrCode: qr
    });
  } catch (error) {
    console.error('Get admin VPL QR error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load QR code settings.'
    });
  }
};

// Admin: upload or replace the QR code using Cloudinary
export const uploadPaymentQR = async (req, res) => {
  let uploadedQR = null;
  let databaseSaved = false;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a QR code image.'
      });
    }

    const previousQR = await VPLPaymentQR.findOne()
      .sort({ updatedAt: -1 });

    // Keep the old asset details before updating MongoDB.
    const oldPublicId = previousQR?.publicId;
    const oldResourceType = previousQR?.resourceType || 'image';

    // Upload the new QR image to Cloudinary.
    uploadedQR = await uploadBufferToCloudinary(
      req.file,
      'vadgaon-heros/vpl'
    );

    if (uploadedQR.resourceType !== 'image') {
      throw new Error('The payment QR must be an image.');
    }

    let savedQR;

    if (previousQR) {
      previousQR.imageUrl = uploadedQR.url;
      previousQR.publicId = uploadedQR.publicId;
      previousQR.resourceType = uploadedQR.resourceType;
      previousQR.originalName = req.file.originalname;
      previousQR.uploadedBy = req.user._id;

      savedQR = await previousQR.save();
    } else {
      savedQR = await VPLPaymentQR.create({
        imageUrl: uploadedQR.url,
        publicId: uploadedQR.publicId,
        resourceType: uploadedQR.resourceType,
        originalName: req.file.originalname,
        uploadedBy: req.user._id
      });
    }

    databaseSaved = true;

    // Delete the previous Cloudinary QR only after saving the new one.
    if (oldPublicId && oldPublicId !== uploadedQR.publicId) {
      try {
        await deleteCloudinaryAsset(
          oldPublicId,
          oldResourceType
        );
      } catch (deleteError) {
        console.error(
          'Old Cloudinary QR cleanup error:',
          deleteError.message
        );
      }
    }

    return res.status(previousQR ? 200 : 201).json({
      success: true,
      message: previousQR
        ? 'Payment QR code replaced successfully.'
        : 'Payment QR code uploaded successfully.',
      qrCode: savedQR
    });
  } catch (error) {
    console.error('Upload VPL QR error:', error);

    // If MongoDB saving failed, remove the newly uploaded QR.
    if (uploadedQR?.publicId && !databaseSaved) {
      await deleteCloudinaryAsset(
        uploadedQR.publicId,
        uploadedQR.resourceType
      ).catch((deleteError) => {
        console.error(
          'New Cloudinary QR cleanup error:',
          deleteError.message
        );
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload payment QR code.'
    });
  }
};

// Admin: update payment status after verifying payment manually
export const updateVPLPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID.'
      });
    }

    if (!['Pending', 'Paid'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status.'
      });
    }

    const registration = await VPLRegistration.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'VPL registration not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully.',
      registration
    });
  } catch (error) {
    console.error('Update VPL payment status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update payment status.'
    });
  }
};
