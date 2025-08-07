import express from "express";
import routes from "./routes/routes.js"
import cors from "cors"
import {connectToDB} from "./db.js"
import { fetchAndStoreData } from "./utils/cron.js";
import cron from "node-cron"
import * as dotenv from "dotenv"
dotenv.config()
const port=process.env.PORT || 5002;
const app=express();



app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://135.181.192.4');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
// res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.get("/", (req,res)=>{
  res.send("<h1>hello from express server </h1>")
});

// fetchAndStoreData()
// Schedule the task to run every morning at 8 AM
// cron.schedule('0 8 * * *', fetchAndStoreData);

app.use("/api", routes);

connectToDB().then(()=>{
  app.listen(port, ()=>{
    console.log(`server started at: http://localhost:${port}`)
  })
}).catch((err)=>{
  console.log(err)
})


