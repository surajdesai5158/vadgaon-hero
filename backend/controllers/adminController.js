
import mongoose from 'mongoose';
import User from '../models/User.js';
import VPLRegistration from '../models/VPLRegistration.js';

// Get all users for the admin panel
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.',
    });
  }
};

// Approve or reject a registered user
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user status.',
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, role: 'user' },
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Registered user not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${status} successfully.`,
      user,
    });
  } catch (error) {
    console.error('Update user status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user status.',
    });
  }
};

// Permanently delete a registered user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID.',
      });
    }

    // Only registered user accounts can be deleted here.
    // Admin accounts are protected.
    const user = await User.findOne({
      _id: id,
      role: 'user',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Registered user not found or cannot be deleted.',
      });
    }

    // Delete this user's VPL registrations first.
    await VPLRegistration.deleteMany({ user: user._id });

    // Delete the registered user account.
    await User.deleteOne({ _id: user._id, role: 'user' });

    return res.status(200).json({
      success: true,
      message: 'Registered user and their VPL registrations deleted successfully.',
      deletedUserId: user._id,
    });
  } catch (error) {
    console.error('Delete user error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete registered user.',
    });
  }
};
