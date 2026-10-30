
import mongoose from 'mongoose';
import DiwaliMemory from '../models/DiwaliMemory.js';

import {
  uploadBufferToCloudinary,
  deleteCloudinaryAsset
} from '../middleware/cloudinaryUpload.js';

// Get all Diwali memories
export const getDiwaliMemories = async (req, res) => {
  try {
    const memories = await DiwaliMemory.find()
      .sort({ year: -1, createdAt: -1 })
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      memories
    });
  } catch (error) {
    console.error('Get Diwali memories error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Diwali memories.'
    });
  }
};

// Add a Diwali memory with photos/videos
export const createDiwaliMemory = async (req, res) => {
  const uploadedAssets = [];

  try {
    const year = Number(req.body.year);
    const title = String(req.body.title || '').trim();
    const description = String(req.body.description || '').trim();

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid celebration year.'
      });
    }

    if (!title || title.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be 150 characters or fewer.'
      });
    }

    if (description.length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot exceed 3000 characters.'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one photo or video.'
      });
    }

    // Upload files one by one to Cloudinary
    for (const file of req.files) {
      console.log('Uploading Diwali file:', file.originalname);

      const uploadedMedia = await uploadBufferToCloudinary(
        file,
        'vadgaon-heros/diwali'
      );

      uploadedAssets.push(uploadedMedia);

      console.log(
        'Cloudinary upload successful:',
        uploadedMedia.publicId
      );
    }

    const media = uploadedAssets.map((asset) => ({
      url: asset.url,
      type: asset.resourceType === 'video' ? 'video' : 'image',
      publicId: asset.publicId,
      resourceType: asset.resourceType,
      originalName: asset.originalName,
      mimetype: asset.mimetype,
      size: asset.size
    }));

    const memory = await DiwaliMemory.create({
      year,
      title,
      description,
      media,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Diwali memory added successfully.',
      memory
    });

  } catch (error) {
    console.error('Create Diwali memory error:', {
      message: error.message,
      code: error.code,
      http_code: error.http_code,
      name: error.name
    });

    // Clean up successfully uploaded files if the operation fails
    for (const asset of uploadedAssets) {
      try {
        const result = await deleteCloudinaryAsset(
          asset.publicId,
          asset.resourceType
        );

        console.log(
          'Cloudinary cleanup result:',
          result?.result || 'No result returned'
        );

      } catch (deleteError) {
        console.error('Cloudinary cleanup failed:', {
          message: deleteError.message,
          code: deleteError.code,
          http_code: deleteError.http_code
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to save Diwali memory. Please try again.'
    });
  }
};

// Delete a Diwali memory and its Cloudinary media
export const deleteDiwaliMemory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid memory ID.'
      });
    }

    const memory = await DiwaliMemory.findById(id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Diwali memory not found.'
      });
    }

    // Delete Cloudinary assets.
    // Old local media without publicId are preserved.
    for (const item of memory.media) {
      if (!item.publicId) {
        continue;
      }

      const result = await deleteCloudinaryAsset(
        item.publicId,
        item.resourceType || item.type || 'image'
      );

      if (
        result?.result !== 'ok' &&
        result?.result !== 'not found'
      ) {
        throw new Error(
          `Could not delete Cloudinary media: ${item.publicId}`
        );
      }
    }

    await DiwaliMemory.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Diwali memory and its Cloudinary media deleted successfully.'
    });

  } catch (error) {
    console.error('Delete Diwali memory error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete Diwali memory or its Cloudinary media.'
    });
  }
};
