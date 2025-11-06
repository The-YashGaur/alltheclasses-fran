// config/cloudinary.js
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
};

if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.warn('⚠️ Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
}

cloudinary.config(config);

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // prefer extension from original name (e.g. "file.pdf")
    let ext = '';
    try {
      ext = path.extname(file.originalname).replace('.', '').toLowerCase();
    } catch (err) { ext = ''; }

    // fallback from mimetype (image/pdf/docx)
    if (!ext && file.mimetype) {
      const parts = file.mimetype.split('/');
      ext = (parts[1] || '').split('+')[0];
    }

    const isImage = file.mimetype && file.mimetype.startsWith('image/');
    const resource_type = isImage ? 'image' : 'raw';

    // Use a deterministic but unique public id, still add timestamp
    const safeField = (file.fieldname || 'file').replace(/\W/g, '_');

    const params = {
      folder: 'franchise-applications',
      public_id: `${safeField}-${Date.now()}`,
      resource_type
    };

    // For raw files (pdf/doc), set format so URL contains extension
    if (ext) params.format = ext;

    return params;
  }
});

module.exports = { cloudinary, storage };
