import mongoose from 'mongoose';

const prorataStaffSchema = mongoose.Schema({
  salesrep: {
    type: String,
    required: true
  },
  salelocation: {
    type: String,
    required: true
  },
  // Individual targets for this staff member
  AcceGP_Handset_Sales: {
    type: Number,
  },
  dpc: {
    type: Number,
  },
  ppn: {
    type: Number,
  },
  bundel: {
    type: Number,
  },
  tmb: {
    type: Number,
  },
  tyro: {
    type: Number,
  },
  websitebas: {
    type: Number,
  },
  sbNbn: {
    type: Number,
  },
  devicesecurity: {
    type: Number,
  },
  // Custom GP Tier Thresholds for this staff member
  gpGreenTarget: {
    type: Number,
  },
  gpTier2Threshold: {
    type: Number,
  },
  gpTier3Threshold: {
    type: Number,
  },
  // Product bonuses specific to this staff member
  productBonuses: [{
    product: {
      type: String,
      required: true
    },
    bonusValue: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  // Date range for which these targets apply
  createdDate: {
    type: Date,
    required: true
  },
}, { timestamps: true });

const ProrataStaff = mongoose.model('ProrataStaff', prorataStaffSchema);

export default ProrataStaff;
