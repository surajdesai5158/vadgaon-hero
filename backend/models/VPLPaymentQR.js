
import mongoose from 'mongoose';

const vplPaymentQRSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'QR code image URL is required'],
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
      trim: true,
      maxlength: 255
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const VPLPaymentQR = mongoose.model(
  'VPLPaymentQR',
  vplPaymentQRSchema
);

export default VPLPaymentQR;
