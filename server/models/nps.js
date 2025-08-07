import mongoose from "mongoose";

const npsSchema = mongoose.Schema(
  {
    salesrep: { type: String,  required: true  },
    salelocation: { type: String,  required: true  },
    NPSVol: { type: Number },
    NPSScore: { type: Number },
    adv10_9: { type: Number },
    pass8_7: { type: Number },
    detr_less_6: { type: Number },
    createdDate: { type: Date,  required: true },
    updatedBy: { type: String ,  required: true },
  },
  { timestamps: true }
);

const NPS = mongoose.model("NPS", npsSchema);

export default NPS;
