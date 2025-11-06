// routes/applications.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const { storage, cloudinary } = require('../config/cloudinary');
require('colors');

const router = express.Router();

// multer using cloudinary storage
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error('Only .jpeg, .jpg, .png, .pdf, .doc, and .docx files allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Helper: normalize uploaded file fieldname into a simple key (idProof etc)
function normalizeFileFieldName(fieldname) {
  // bracket notation like documents[idProof] => idProof
  const bracketMatch = fieldname.match(/([^\[\]]+)\[([^\]]+)\]$/);
  if (bracketMatch) return bracketMatch[2];
  // dot notation documents.idProof => idProof
  if (fieldname.includes('.')) {
    const parts = fieldname.split('.');
    return parts[parts.length - 1];
  }
  return fieldname;
}

// Safe parse primitive values from strings
function parseValue(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === 'object') return v;
  if (typeof v !== 'string') return v;
  const s = v.trim();
  if (s === '') return '';
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  // JSON object/array
  if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
    try {
      return JSON.parse(s);
    } catch (err) {
      // continue
    }
  }
  // numeric
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  return v;
}

// Convert flat body keys into nested object (basic bracket/dot parsing)
function unflatten(body) {
  const out = {};
  const makeParts = (key) => {
    const parts = [];
    let cur = '';
    for (let i = 0; i < key.length; i++) {
      const ch = key[i];
      if (ch === '[') {
        if (cur) { parts.push(cur); cur = ''; }
      } else if (ch === ']') {
        if (cur) { parts.push(cur); cur = ''; }
      } else if (ch === '.') {
        if (cur) { parts.push(cur); cur = ''; }
      } else {
        cur += ch;
      }
    }
    if (cur) parts.push(cur);
    return parts;
  };

  Object.keys(body || {}).forEach((flatKey) => {
    const rawValue = body[flatKey];
    const parts = makeParts(flatKey);
    let cur = out;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      if (isLast) {
        cur[part] = parseValue(rawValue);
      } else {
        if (cur[part] == null || typeof cur[part] !== 'object') {
          cur[part] = {};
        }
        cur = cur[part];
      }
    }
  });

  return out;
}

// POST /api/applications
router.post('/', upload.any(), async (req, res) => {
  try {
    console.log('\n=== 🚀 New Application Submission ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Raw body keys:', Object.keys(req.body || {}));
    console.log('Received files (fieldnames):', (req.files || []).map(f => f.fieldname));

    // Log full files for debugging (not too large)
    if (req.files && req.files.length) {
      console.log('FILES DUMP:', req.files.map(f => {
        // selectively pick properties to avoid circulars
        return {
          fieldname: f.fieldname,
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
          path: f.path,
          secure_url: f.secure_url,
          url: f.url,
          location: f.location,
          filename: f.filename,
          public_id: f.public_id,
          resource_type: f.resource_type
        };
      }));
    }

    // 1) If frontend sent a single JSON "formData" string, parse it
    let parsed = {};
    if (req.body && req.body.formData && typeof req.body.formData === 'string') {
      try {
        parsed = JSON.parse(req.body.formData);
      } catch (err) {
        console.warn('formData JSON parse failed - falling back to unflattening body');
      }
    }

    // 2) Otherwise unflatten req.body into nested structure
    if (!parsed || Object.keys(parsed).length === 0) {
      parsed = unflatten(req.body || {});
    }

    // 3) Map uploaded files into documents (merge with any parsed.documents)
    const documents = (parsed.documents && typeof parsed.documents === 'object') ? { ...parsed.documents } : {};

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const key = normalizeFileFieldName(file.fieldname) || file.fieldname;

        // Try many possible URL properties (multer-storage-cloudinary has changed across versions)
        const url = file.path || file.secure_url || file.url || file.location || (file._json && file._json.secure_url) || '';
        const public_id = file.filename || file.public_id || (file._json && file._json.public_id) || '';
        const mimetype = file.mimetype || (file._json && file._json.format) || '';
        const resource_type = file.resource_type || (mimetype && mimetype.startsWith('image/') ? 'image' : 'raw');

        documents[key] = {
          url,
          public_id,
          format: mimetype || '',
          size: file.size || 0,
          resource_type,
          uploadedAt: new Date()
        };
      });
    }

    parsed.documents = documents;

    // Basic required fields - adapt as you need
    const required = ['fullName', 'email'];
    const missing = [];
    required.forEach((f) => { if (!parsed[f]) missing.push(f); });
    if (!parsed.mobileNumber && !parsed.phoneNumber) missing.push('mobileNumber');

    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields', missing });
    }

    // Create application document (ensure types align with your schema)
    const applicationData = {
      ...parsed,
      submittedAt: new Date()
    };

    const application = new Application(applicationData);
    const saved = await application.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: saved._id,
    });
  } catch (err) {
    console.error('❌ Error creating application:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'One or more files exceed the 5MB size limit' });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// Cloudinary raw upload test route
router.get('/cloudinary-raw-test', async (req, res) => {
  try {
    if (!cloudinary) return res.status(500).json({ success: false, message: 'Cloudinary not configured' });
    // small raw text as data URI (text/plain) so cloudinary will store as raw
    const result = await cloudinary.uploader.upload('data:text/plain;base64,SGVsbG8gV29ybGQh', {
      folder: 'franchise-applications/test',
      resource_type: 'raw'
    });
    // Return entire result - check result.secure_url (should include /raw/upload/)
    res.json({ success: true, result });
  } catch (err) {
    console.error('Cloudinary raw test failed', err);
    res.status(500).json({ success: false, message: 'Cloudinary raw test failed', error: err.message });
  }
});

// GET all applications
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    console.error('DB error by id', err);
    res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

module.exports = router;
