
import mongoose from 'mongoose';

const vplRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email cannot exceed 254 characters']
    },

    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [10, 'Player must be at least 10 years old'],
      max: [100, 'Please enter a valid age'],
      validate: {
        validator: Number.isInteger,
        message: 'Age must be a whole number'
      }
    },

    position: {
      type: String,
      required: [true, 'Playing position is required'],
      enum: [
        'Batsman',
        'Bowler',
        'Wicket Keeper',
        'All-Rounder'
      ]
    },

    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Cash', 'Online']
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },

    registrationStatus: {
      type: String,
      enum: ['Registered', 'Cancelled'],
      default: 'Registered'
    }
  },
  {
    timestamps: true
  }
);

// Prevent the same account from registering multiple times.
// The unique index applies to each user account.
vplRegistrationSchema.index(
  { user: 1 },
  { unique: true }
);

const VPLRegistration = mongoose.model(
  'VPLRegistration',
  vplRegistrationSchema
);

export default VPLRegistration;
