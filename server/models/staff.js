import mongoose from 'mongoose';

const staffSchema = mongoose.Schema({
  salesrep: {
    type: String,
    required: true,
    trim: true
  },
  salelocation: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound unique index - same salesrep can work in multiple locations
// but not duplicate entries for same salesrep at same location
staffSchema.index({ salesrep: 1, salelocation: 1 }, { unique: true });

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
