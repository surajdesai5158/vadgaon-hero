
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();

// Allowed file types for general uploads (Cricket and Diwali)
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

// General file filter
const fileFilter = (req, file, callback) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return callback(
      new Error(
        'Only JPG, PNG, WEBP, GIF images and MP4, WEBM, MOV videos are allowed.'
      )
    );
  }

  callback(null, true);
};

// VPL QR accepts only JPG, PNG and WEBP
const vplQRFileFilter = (req, file, callback) => {
  const allowedQRTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedQRTypes.includes(file.mimetype)) {
    return callback(
      new Error('Only JPG, PNG, or WEBP QR code images are allowed.')
    );
  }

  callback(null, true);
};

// Create upload middleware with custom limits and file filter
const createCloudinaryUpload = ({
  fileSize = 50 * 1024 * 1024,
  files = 20,
  filter = fileFilter
} = {}) =>
  multer({
    storage,
    fileFilter: filter,
    limits: {
      fileSize,
      files
    }
  });

// General uploads: 50 MB per file, maximum 20 files
const cloudinaryUpload = createCloudinaryUpload();

// VPL QR: 5 MB maximum, one image, JPG/PNG/WEBP only
export const vplQRUpload = createCloudinaryUpload({
  fileSize: 5 * 1024 * 1024,
  files: 1,
  filter: vplQRFileFilter
});

// Upload file to Cloudinary
export const uploadBufferToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    if (!file?.buffer) {
      return reject(new Error('Uploaded file buffer is missing.'));
    }

    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });
      }
    ).end(file.buffer);
  });

// Delete file from Cloudinary
export const deleteCloudinaryAsset = async (
  publicId,
  resourceType = 'image'
) => {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  });
};

export default cloudinaryUpload;
