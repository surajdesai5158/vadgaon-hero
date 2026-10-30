
import VillageImprovement from '../models/VillageImprovement.js';
import {
  uploadBufferToCloudinary,
  deleteCloudinaryAsset
} from '../middleware/cloudinaryUpload.js';

// Get all village improvement records
export const getVillageImprovements = async (req, res) => {
  try {
    const records = await VillageImprovement.find()
      .sort({ date: -1, createdAt: -1 })
      .populate('createdBy', 'name');

    return res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    console.error('Get village improvements error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch village improvements.'
    });
  }
};

// Admin: Create a village improvement record
export const createVillageImprovement = async (req, res) => {
  const uploadedAssets = [];

  try {
    const { date, subject, description = '' } = req.body;

    if (!date || !subject?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Date and subject are required.'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one photo or video.'
      });
    }

    for (const file of req.files) {
      const asset = await uploadBufferToCloudinary(
        file,
        'vadgaon-heros/village-improvements'
      );

      uploadedAssets.push({
        url: asset.url,
        type: asset.resourceType === 'video' ? 'video' : 'image',
        publicId: asset.publicId,
        resourceType: asset.resourceType,
        originalName: asset.originalName,
        mimetype: asset.mimetype,
        size: asset.size
      });
    }

    const record = await VillageImprovement.create({
      date: new Date(date),
      subject: subject.trim(),
      description: description.trim(),
      media: uploadedAssets,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Village improvement added successfully.',
      record
    });
  } catch (error) {
    console.error('Create village improvement error:', error);

    // Clean up uploaded Cloudinary files if saving fails
    for (const asset of uploadedAssets) {
      try {
        await deleteCloudinaryAsset(
          asset.publicId,
          asset.resourceType
        );
      } catch (cleanupError) {
        console.error('Cloudinary cleanup error:', cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to add village improvement.'
    });
  }
};

// Admin: Delete a village improvement record
export const deleteVillageImprovement = async (req, res) => {
  try {
    const record = await VillageImprovement.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Village improvement record not found.'
      });
    }

    // Delete Cloudinary files where publicId exists.
    // Older/local media without publicId are left untouched.
    for (const media of record.media) {
      if (media.publicId) {
        try {
          await deleteCloudinaryAsset(
            media.publicId,
            media.resourceType || 'image'
          );
        } catch (cloudinaryError) {
          console.error('Cloudinary delete error:', cloudinaryError);
        }
      }
    }

    await VillageImprovement.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Village improvement deleted successfully.'
    });
  } catch (error) {
    console.error('Delete village improvement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete village improvement.'
    });
  }
};
