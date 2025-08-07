import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
  invoice: {
    type: String,
  },
  movdate: {
    type: String,
  },
  originalsaledate: {
    type: String,
    
  },
  movementevent: {
    type: String,
    
  },
  linetype: {
    type: String,
    
  },
  lineitemcode: {
    type: String,
    
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
