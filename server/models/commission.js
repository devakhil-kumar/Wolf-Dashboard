import mongoose from "mongoose";

const CommissionSchema = new mongoose.Schema({
  salesrep: { type: String, required: true },
  salelocation: { type: String, required: true },
  createdDate: { type: Date, required: true },
  ownerCommission: { type: Number, required: true },
  updatedBy: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const commission = mongoose.model('Commission', CommissionSchema);
export default commission