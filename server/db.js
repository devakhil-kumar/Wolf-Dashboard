import mongoose from "mongoose";
import * as dotenv from "dotenv"
dotenv.config()

const connectionURL = process.env.MONGO_URI
console.log(connectionURL,"jj")
export const connectToDB = async() => {

  mongoose.connect(connectionURL, {}).then(() => {
    console.log("db connected successfully")
  }).catch((err) => {
    console.log(err,"hh")
  })

}