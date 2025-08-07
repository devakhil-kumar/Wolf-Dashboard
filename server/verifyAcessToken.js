import jwt  from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config()

const middleware=async(req,res,next)=>{
  console.log(req.headers);
  if(!req.headers.authorization){
    res.status(401).send({message:"unauthorized user"});
  }
    const token= req.headers.authorization.split(" ")[0];
    const decoded= jwt.verify(token, process.env.JWT_SECRET);
    req.userId=decoded.id
    next();
}

export default middleware