import jwt from 'jsonwebtoken';
const genToken= async (userId)=>{
  try{
    // Generate a JWT token with user ID and secret key
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token validity period
    });
    return token;
  }
  catch(error){
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
}

export default genToken;