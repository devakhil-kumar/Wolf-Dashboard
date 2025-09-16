import mongoose from "mongoose";
import { Schema } from "mongoose";

const adminSchema= new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true,select:false},
   role: {
      type: String,
      enum: [ 'admin','manager', 'staff','demo'], // Add more roles if needed
      default: 'staff',
      required: true
    }
},{
  timestamps: true
},{
  versionKey:false
})

const Admin= mongoose.model("Admin",adminSchema);
export default Admin