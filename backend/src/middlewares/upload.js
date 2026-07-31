const multer = require('multer');

// Files are kept in memory only (never written to disk) since we just need
// the bytes long enough to hand them to Claude or a text extractor.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Upload an image, PDF, or text file.'));
    }
  },
});

module.exports = upload;
