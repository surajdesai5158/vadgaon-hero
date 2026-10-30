
import mongoose from 'mongoose';

const cricketMemorySchema = new mongoose.Schema(
  {
    seasonNumber: {
      type: Number,
      required: [true, 'Season number is required'],
      min: [1, 'Season number must be at least 1']
    },

    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [2100, 'Year cannot be later than 2100']
    },

    firstPrize: {
      teamName: {
        type: String,
        required: [true, 'First prize team name is required'],
        trim: true
      },
      ownerName: {
        type: String,
        required: [true, 'First prize owner name is required'],
        trim: true
      }
    },

    secondPrize: {
      teamName: {
        type: String,
        required: [true, 'Second prize team name is required'],
        trim: true
      },
      ownerName: {
        type: String,
        required: [true, 'Second prize owner name is required'],
        trim: true
      }
    },

    totalTeams: {
      type: Number,
      required: [true, 'Total teams are required'],
      min: [2, 'At least 2 teams are required']
    },

    teams: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (items) => items.length >= 2,
          message: 'At least 2 team names are required'
        },
        {
          validator: (items) =>
            items.every((name) => name && name.trim().length > 0),
          message: 'Every team must have a name'
        }
      ]
    },

    photos: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true
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
            trim: true
          },

          mimetype: {
            type: String,
            trim: true
          },

          size: {
            type: Number,
            min: 0
          }
        }
      ],
      validate: {
        validator: (items) => items.length > 0,
        message: 'At least one cricket photo is required'
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

// Team count must match the entered team names.
cricketMemorySchema.pre('validate', function () {
  if (this.totalTeams !== this.teams.length) {
    this.invalidate(
      'totalTeams',
      'Total teams must match the number of team names.'
    );
  }
});

// Prevent duplicate season numbers.
cricketMemorySchema.index(
  { seasonNumber: 1 },
  { unique: true }
);

cricketMemorySchema.index({ year: -1, createdAt: -1 });

const CricketMemory = mongoose.model(
  'CricketMemory',
  cricketMemorySchema
);

export default CricketMemory;
