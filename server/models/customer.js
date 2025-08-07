import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerid: {
    type: String,
   
  },
  coname: {
    type: String,
   
  },
  name: {
    type: String,
   
  },
  surname: {
    type: String,
   
  },
  shattention: {
    type: String,
    
  },
  shname: {
    type: String,
   
  },
  shadd: {
    type: String,
   
  },
  shadd1: {
    type: String,
    
  },
  shadd2: {
    type: String,
    
  },
  shsub: {
    type: String,
    
  },
  shpcode: {
    type: Number,
   
  },
  shstate: {
    type: String,
   
  },
  branchcode: {
    type: Number,
    
  },
  salelocation: {
    type: String,
    
  },
  saledate_rep_: {
    type: String,
  },
  salesrep: {
    type: String,
   require:true
  },
  internalref: {
    type: String,
    
  },
  promotype: {
    type: String,
    
  },
  invoice: {
    type: Number,
    
  },
  mob: {
    type: String,
    
  },
  imei: {
    type: String,
    
  },
  orderref: {
    type: String,
    
  },
  connectref: {
    type: String,
    
  },
  accbarcode: {
    type: String,
    
  },
  accdesc: {
    type: String,
    
  },
  amt_rec: {
    type: Number,
    
  },
  purchprice: {
    type: Number,
    
  },
  saleprice: {
    type: Number,
    
  },
  discount: {
    type: Number,
    
  },
  plancat: {
    type: String,
    
  },
  plantype: {
    type: String,
    
  },
  carrier: {
    type: String,
    
  },
  contractends_rep_: {
    type: String,
    
  },
  contractperiod: {
    type: Number,
    
  },
  phonetype: {
    type: String,
    
  },
  notes: {
    type: String,
    
  },
  code: {
    type: Number,
    
  },
  stockgst: {
    type: Number,
    
  },
  salestax: {
    type: Number,
    
  },
  lastupdated: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    
  },
  mastercategory: {
    type: String,
    
  },
  refundinvoice: {
    type: String,
    
  },
  refundrefcode: {
    type: String,
    
  },
  rebate: {
    type: Number,
    
  },
  rebaterecamt: {
    type: Number,
    
  },
  rebatedate: {
    type: String,
    default: ""
  },
  commission: {
    type: Number,
    
  },
  commrecamt: {
    type: Number,
    
  },
  commdate: {
    type: String,
    default: ""
  },
  bonus1: {
    type: Number,
    
  },
  bonusrecamt1: {
    type: Number,
    
  },
  bonus1receivedate: {
    type: String,
    default: ""
  },
  bonus2: {
    type: Number,
    
  },
  bonusrecamt2: {
    type: Number,
    
  },
  bonus2receivedate: {
    type: String,
    
  },
  repcommamt: {
    type: Number,
    
  },
  reppayamt: {
    type: Number,
    
  },
  paiddate: {
    type: String,
    default: ""
  },
  adddeddesc1: {
    type: String,
    
  },
  adddedamt1: {
    type: Number,
    
  },
  adddeddate1exp: {
    type: String,
    
  },
  adddedrecamt1: {
    type: Number,
    
  },
  adddeddate1: {
    type: String,
    default: ""
  },
  adddeddesc2: {
    type: String,
    
  },
  adddedamt2: {
    type: Number,
    
  },
  adddeddate2exp: {
    type: String,
    
  },
  adddedrecamt2: {
    type: Number,
    
  },
  adddeddate2: {
    type: String,
    default: ""
  },
  adddeddesc3: {
    type: String,
    
  },
  adddedamt3: {
    type: Number,
    
  },
  adddeddate3exp: {
    type: String,
    
  },
  adddedrecamt3: {
    type: Number,
    
  },
  adddeddate3: {
    type: String,
    default: ""
  },
  activedate: {
    type: String,
    default: ""
  },
  reconciliationnotes: {
    type: String,
    
  },
  productcommpercentage: {
    type: Number,
    
  }
}, { timestamps: true, versionKey: false });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
