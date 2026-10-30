
import express from 'express';
import DiwaliMemory from '../models/DiwaliMemory.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Every request must come from an approved, logged-in account.
router.use(authMiddleware);

// GET /api/diwali
// GET /api/diwali?year=2025
// Read-only access to Diwali memories.
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.year !== undefined) {
      const year = Number(req.query.year);

      if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        return res.status(400).json({
          success: false,
          message: 'Please select a valid year.'
        });
      }

      filter.year = year;
    }

    const memories = await DiwaliMemory.find(filter)
      .sort({ year: -1, createdAt: -1 })
      .select('year title description media createdAt');

    res.status(200).json({
      success: true,
      memories
    });
  } catch (error) {
    console.error('Get user Diwali memories error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to load Diwali memories.'
    });
  }
});

export default router;
