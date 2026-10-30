
import mongoose from 'mongoose';

const villageMediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    publicId: {
      type: String,
      default: ''
    },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw', ''],
      default: 'image'
    },
    originalName: {
      type: String,
      default: ''
    },
    mimetype: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    }
  },
  { _id: true }
);

const villageImprovementSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: ''
    },
    media: {
      type: [villageMediaSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: 'At least one photo or video is required.'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const VillageImprovement = mongoose.model(
  'VillageImprovement',
  villageImprovementSchema
);

export default VillageImprovement;
