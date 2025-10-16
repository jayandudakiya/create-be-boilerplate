import multer from 'multer';

// ----------------------------
// Storage
// ----------------------------
const storage = multer.memoryStorage();

// ----------------------------
// Limits
// ----------------------------
const MAX_FILE_SIZE = process.env.MAX_IMAGE_SIZE || 20 * 1024 * 1024; // 20 MB default
const limits = { fileSize: MAX_FILE_SIZE };

// ----------------------------
// Allowed file types
// ----------------------------
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// ----------------------------
// Multer instance
// ----------------------------
const upload = multer({
  storage,
  fileFilter,
  limits,
});

// ----------------------------
// Middleware for single/multiple uploads
// ----------------------------
export const singleUpload =
  (fieldName = 'image') =>
  (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ status: 'fail', message: err.message });
      } else if (err) {
        return res.status(400).json({ status: 'fail', message: err.message });
      }
      next();
    });
  };

export const multipleUpload =
  (fieldName = 'images', maxCount = 5) =>
  (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ status: 'fail', message: err.message });
      } else if (err) {
        return res.status(400).json({ status: 'fail', message: err.message });
      }
      next();
    });
  };
