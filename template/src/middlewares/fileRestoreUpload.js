import multer from 'multer';

// --------------------------------
// Storage (in memory, can switch to diskStorage if needed)
// --------------------------------
const restoreStorage = multer.memoryStorage();

// --------------------------------
// Limits (size in bytes, configurable via env)
// --------------------------------
const MAX_FILE_SIZE = process.env.RESTORE_MAX_FILE_SIZE || 500 * 1024 * 1024; // 500 MB default
const restoreLimits = { fileSize: MAX_FILE_SIZE };

// --------------------------------
// Allowed MIME types
// --------------------------------
const allowedMimeTypes = ['application/zip', 'application/x-zip-compressed'];

// --------------------------------
// File filter
// --------------------------------
const restoreFileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .zip backup files are allowed!'), false);
  }
};

// --------------------------------
// Multer upload instance
// --------------------------------
const restoreUpload = multer({
  storage: restoreStorage,
  fileFilter: restoreFileFilter,
  limits: restoreLimits,
});

// --------------------------------
// Middleware export
// --------------------------------
// Single file upload with field name "file"
export const fileRestoreUpload = (req, res, next) => {
  restoreUpload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ status: 'fail', message: err.message });
    } else if (err) {
      // Other errors
      return res.status(400).json({ status: 'fail', message: err.message });
    }
    next();
  });
};
