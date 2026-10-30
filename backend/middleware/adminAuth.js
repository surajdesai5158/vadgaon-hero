
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether the token was provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing from the backend .env file.');

      return res.status(500).json({
        success: false,
        message: 'Server authentication is not configured.'
      });
    }

    // Extract and verify the token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      });
    }

    // Verify the current user from the database
    const user = await User.findById(decoded.userId).select(
      '_id name email role status'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    // Only approved administrators can access admin APIs
    if (user.role !== 'admin' || user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Approved administrator access is required.'
      });
    }

    // Make the authenticated administrator available to the next handler
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid or expired. Please log in again.'
      });
    }

    console.error('Admin authentication error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to a server error.'
    });
  }
};

export default adminAuth;
