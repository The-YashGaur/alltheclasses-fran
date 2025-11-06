// backend/models/Application.js
const mongoose = require('mongoose');

// Schema for Cloudinary document references
const DocumentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  format: String,
  size: Number,
  resource_type: {
    type: String,
    enum: ['image', 'raw'],
    default: 'image'
  }
}, { _id: false });

// Schema for documents sub-document
const DocumentsSchema = new mongoose.Schema({
  idProof: DocumentSchema,
  addressProof: DocumentSchema,
  bankStatement: DocumentSchema,
  experienceCertificate: DocumentSchema,
  premisesPhoto: DocumentSchema
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  // Step 1: Purpose
  purposeAcknowledged: {
    type: Boolean,
    required: [true, 'Please acknowledge the purpose of this form'],
  },

  // Step 2: Instructions
  instructionsAcknowledged: {
    type: Boolean,
    required: [true, 'Please acknowledge the instructions'],
  },

  // Step 3: Basic Details
  fullName: {
    type: String,
    required: [true, 'Please enter your full name'],
    trim: true,
    index: true,
  },
  age: {
    type: Number,
    required: [true, 'Please enter your age'],
    min: [18, 'You must be at least 18 years old'],
  },
  gender: {
    // accept the strings your front-end uses
    type: String,
    enum: ['male', 'female', 'other', 'preferNotToSay', 'prefer-not-to-say'],
    required: [true, 'Please select your gender'],
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please enter your mobile number'],
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true,
  },
  currentAddress: {
    type: String,
    required: [true, 'Please enter your current address'],
    trim: true,
  },
  permanentAddress: {
    type: String,
    trim: true,
  },
  highestQualification: {
    type: String,
    required: [true, 'Please enter your highest qualification'],
    trim: true,
  },
  currentOccupation: {
    type: String,
    trim: true,
  },

  // Step 4: Franchise / Business Details
  targetCity: {
    type: String,
    trim: true,
    // earlier schema required it; keep optional so frontend doesn't fail when empty
    // required: [true, 'Please enter target city'],
  },
  // Proposed premises now stored as object to match front-end shape
  proposedPremises: {
    floor: { type: String, trim: true, default: '' },
    otherDetails: { type: String, trim: true, default: '' }
  },

  // Accept the user-friendly targetClass labels coming from frontend
  targetClasses: [{
    type: String,
    enum: [
      'Class 6-8',
      'Class 9-10',
      'Class 11-12 (Science)',
      'Class 11-12 (Commerce)',
      'JEE',
      'NEET',
      'Foundation / Olympiad',
      'Other'
    ]
  }],

  // Management types as per frontend options
  managementType: {
    type: String,
    enum: ['self', 'team', 'both', 'partnership', 'corporate'],
  },

  // Accept rupee-format investment ranges from frontend
  investmentRange: {
    type: String,
    enum: ['₹5-7 lakhs', '₹7-10 lakhs', '₹10-15 lakhs', 'Above ₹15 lakhs', '5-10L', '10-20L', '20-30L', '30L+'],
  },

  // Step 5: Operations and Teams Details
  previousExperience: {
    type: String,
    trim: true,
  },
  expectedStudents: {
    type: Number,
    min: [1, 'Expected students must be at least 1'],
  },
  availableStaff: {
    type: Number,
    min: [0, 'Number cannot be negative'],
  },
  classSchedule: {
    type: String,
    trim: true,
  },
  hybridModel: {
    type: Boolean,
  },

  // Teaching team object (matches front-end nested object)
  teachingTeam: {
    hasTeam: { type: Boolean, default: false },
    teamSize: { type: Number, min: 0 },
    openToTraining: { type: Boolean, default: false }
  },

  // Step 6: Branding and Marketing
  marketing: {
    hasBudget: { type: Boolean, default: false },
    budget: { type: Number, min: 0 },
    hasNetwork: { type: Boolean, default: false },
    networkDetails: { type: String, trim: true }
  },
  marketingNotes: { type: String, trim: true },

  // Step 7: Seriousness, Mindset & Alignment
  timeframe: {
    type: String, // removed rigid enum to accept varying values (frontend sometimes sends '')
    trim: true,
  },
  // motivation may arrive as single string or array — store as array
  motivation: [{
    type: String,
    trim: true
  }],
  otherMotivation: {
    type: String,
    trim: true,
  },
  fullTimeDedication: {
    type: Boolean,
  },
  educationBeliefs: {
    characterBuilding: Boolean,
    stressFreeLearning: Boolean,
    newMethodologies: Boolean,
    transparentCommunication: Boolean,
  },
  classroomEnvironment: {
    type: String,
    // accept frontend values
    enum: ['friendly', 'result', 'friendly-disciplined', 'result-pressure', null],
    default: null
  },

  // Documents stored in Cloudinary
  documents: {
    type: DocumentsSchema,
    default: {}
  },

  // Additional fields
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },

  // Timestamps (mongoose timestamps is enabled below too)
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Method to get a summary of the application
applicationSchema.methods.getSummary = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    mobileNumber: this.mobileNumber,
    targetCity: this.targetCity,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Pre-save hook to update timestamps and perform light normalization
applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Ensure motivation is an array
  if (this.motivation && !Array.isArray(this.motivation)) {
    this.motivation = [this.motivation];
  }

  // Normalize empty strings to undefined for optionals (so enums don't reject '')
  if (this.timeframe === '') this.timeframe = undefined;
  if (this.classroomEnvironment === '') this.classroomEnvironment = undefined;

  next();
});

// Stats helper
applicationSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        cities: { $addToSet: '$targetCity' }
      }
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
        cities: { $size: '$cities' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  const cities = [...new Set(stats.flatMap(stat => stat.cities))].length;

  return {
    total,
    cities,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat.status] = stat.count;
      return acc;
    }, {})
  };
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
