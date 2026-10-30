
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },

    publicId: {
      type: String,
      trim: true
    },

    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw', ''],
      default: 'image'
    },

    originalName: {
      type: String,
      trim: true,
      maxlength: 255
    },

    mimetype: {
      type: String,
      trim: true
    },

    size: {
      type: Number,
      min: 0
    }
  },
  { _id: true }
);

const diwaliMemorySchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: [true, 'Celebration year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [2100, 'Year cannot be later than 2100'],
      index: true
    },

    title: {
      type: String,
      required: [true, 'Memory title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },

    description: {
      type: String,
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
      default: ''
    },

    media: {
      type: [mediaSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'At least one photo or video is required'
      }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

diwaliMemorySchema.index({ year: -1, createdAt: -1 });

const DiwaliMemory = mongoose.model(
  'DiwaliMemory',
  diwaliMemorySchema
);

export default DiwaliMemory;
