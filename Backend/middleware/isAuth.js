import jwt from 'jsonwebtoken';

const isAuth =async (req,res,next) => {
  try{
     let{token}=req.cookies 
     if(!token){
       return res.status(401).json({message:"Authentication token is missing"}) ;
     }
     let vrifyToken = jwt.verify(token, process.env.JWT_SECRET);
     if(!vrifyToken){
       return res.status(401).json({message:"Invalid authentication token"});
     }
     console.log("Decoded token:", vrifyToken);
     console.log("User ID from token:", vrifyToken.id); 
     req.userId= vrifyToken.id;
     next();
  }
  catch(err){
    console.error("Authentication error:", err);
    throw new Error("Authentication failed");
  }
}
export default isAuth;