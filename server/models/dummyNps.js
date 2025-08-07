import mongoose from "mongoose";

const dummyNps = mongoose.Schema(
  {
    salesrep: { type: String,  required: true  },
    salelocation: { type: String,  required: true  },
    NPSVol: { type: Number },
    NPSScore: { type: Number },
    adv10_9: { type: Number },
    pass8_7: { type: Number },
    detr_less_6: { type: Number },
    createdDate:{ type: Date },
    updatedBy: { type: String ,  required: true },
  },
  { timestamps: true }
);

const DummyNPS = mongoose.model("DummyNPS", dummyNps);

export default DummyNPS;
