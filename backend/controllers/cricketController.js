
import mongoose from 'mongoose';
import CricketMemory from '../models/CricketMemory.js';
import {
  uploadBufferToCloudinary,
  deleteCloudinaryAsset
} from '../middleware/cloudinaryUpload.js';

// Get all Cricket Memories
export const getCricketMemories = async (req, res) => {
  try {
    const memories = await CricketMemory.find()
      .sort({ year: -1, seasonNumber: -1, createdAt: -1 })
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      memories
    });
  } catch (error) {
    console.error('Get Cricket memories error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Cricket memories.'
    });
  }
};

// Add a new Cricket Season Memory
export const createCricketMemory = async (req, res) => {
  const uploadedAssets = [];

  try {
    const seasonNumber = Number(req.body.seasonNumber);
    const year = Number(req.body.year);

    const firstPrizeTeam = String(
      req.body.firstPrizeTeam || ''
    ).trim();

    const firstPrizeOwner = String(
      req.body.firstPrizeOwner || ''
    ).trim();

    const secondPrizeTeam = String(
      req.body.secondPrizeTeam || ''
    ).trim();

    const secondPrizeOwner = String(
      req.body.secondPrizeOwner || ''
    ).trim();

    const totalTeams = Number(req.body.totalTeams);

    let teams;

    try {
      teams = JSON.parse(req.body.teams || '[]');
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid team names format.'
      });
    }

    if (!Number.isInteger(seasonNumber) || seasonNumber < 1) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid season number.'
      });
    }

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid year.'
      });
    }

    if (
      !firstPrizeTeam ||
      !firstPrizeOwner ||
      !secondPrizeTeam ||
      !secondPrizeOwner
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter both prize team names and owner names.'
      });
    }

    if (!Number.isInteger(totalTeams) || totalTeams < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 teams are required.'
      });
    }

    if (
      !Array.isArray(teams) ||
      teams.length !== totalTeams ||
      teams.some(
        (team) => typeof team !== 'string' || !team.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid name for every team and make sure the total matches.'
      });
    }

    const cleanTeams = teams.map((team) => team.trim());

    if (cleanTeams.some((team) => team.length > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Team names cannot exceed 100 characters.'
      });
    }

    if (
      !cleanTeams.some(
        (team) => team.toLowerCase() === firstPrizeTeam.toLowerCase()
      ) ||
      !cleanTeams.some(
        (team) => team.toLowerCase() === secondPrizeTeam.toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'First and second prize teams must be included in the participating team list.'
      });
    }

    if (
      firstPrizeTeam.toLowerCase() === secondPrizeTeam.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: 'First and second prize teams must be different.'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one cricket photo.'
      });
    }

    // Upload photos to Cloudinary
    for (const file of req.files) {
      const uploadedPhoto = await uploadBufferToCloudinary(
        file,
        'vadgaon-heros/cricket'
      );

      uploadedAssets.push(uploadedPhoto);
    }

    const memory = await CricketMemory.create({
      seasonNumber,
      year,

      firstPrize: {
        teamName: firstPrizeTeam,
        ownerName: firstPrizeOwner
      },

      secondPrize: {
        teamName: secondPrizeTeam,
        ownerName: secondPrizeOwner
      },

      totalTeams,
      teams: cleanTeams,

      photos: uploadedAssets,

      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Cricket season memory added successfully.',
      memory
    });
  } catch (error) {
    console.error('Create Cricket memory error:', error);

    // Remove uploaded Cloudinary files if saving fails
    await Promise.all(
      uploadedAssets.map((asset) =>
        deleteCloudinaryAsset(
          asset.publicId,
          asset.resourceType
        ).catch((deleteError) => {
          console.error(
            'Cloudinary cleanup error:',
            deleteError.message
          );
        })
      )
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This season number already exists.'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to save Cricket memory.'
    });
  }
};

// Delete a complete Cricket Season and its photos
export const deleteCricketMemory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Cricket memory ID.'
      });
    }

    const memory = await CricketMemory.findById(id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Cricket memory not found.'
      });
    }

    // Delete Cloudinary assets before deleting the database record
    for (const photo of memory.photos) {
      if (!photo.publicId) {
        continue;
      }

      const result = await deleteCloudinaryAsset(
        photo.publicId,
        photo.resourceType || 'image'
      );

      if (result?.result !== 'ok' && result?.result !== 'not found') {
        throw new Error(
          `Could not delete Cloudinary photo: ${photo.publicId}`
        );
      }
    }

    await CricketMemory.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Cricket season memory and its Cloudinary photos deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Cricket memory error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete Cricket memory or its Cloudinary photos.'
    });
  }
};
