import mongoose from 'mongoose';

const targetSchema = mongoose.Schema({
  salelocation:{
    type:String,
    required:true
  },
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
  devicesecurity: {
    type: Number,
    
  },
  gpGreenTarget:{
    type:Number,
  },
  gpTier2Threshold:{
    type:Number,
  },
  gpTier3Threshold:{
    type:Number,
  },
  createdDate: { type: Date,  required: true },
}, { timestamps: true });

const Target = mongoose.model('Target', targetSchema);

export default Target;
