import mongoose from "mongoose";

const kpiSchema = mongoose.Schema(
  {
    
    salelocation: { type: String,  required: true  },
    KPIPPN: { type: Number },
    KPIBundle: { type: Number },
    KPITMB:{ type: Number },
    KPISBNBN: { type: Number },
   KPITWD: { type: Number },
   KPIDPC: { type: Number },
    KPIACCGP: { type: Number },
    KPIMAIN:{type:Number},
    NPSVoltarget: { type: Number, default: 6 },
    NPSScoreTargetMin: { type: Number, default: 60 },    // New field
    NPSScoreTargetMax: { type: Number, default: 75 },    // New field
    GPCommissionPercentage: { type: Number, default: 4 },
    GPTier2Percentage: { type: Number, default: 5.5 },
    GPTier3Percentage: { type: Number, default: 7 },
    NPSMultiplierLow: { type: Number, default: 0.5 },    // New field
    NPSMultiplierMid: { type: Number, default: 1.0 },    // New field
    NPSMultiplierHigh: { type: Number, default: 1.5 },   // New field
    createdDate: { type: Date,  required: true },
    updatedBy: { type: String ,  required: true },
  },
  { timestamps: true }
);

const KPI = mongoose.model("KPITarget", kpiSchema);

export default KPI;
