
import User from "../models/user.model.js";
import uploadOnCloudinary from './../config/cloudinary.js';



export const getCurrentUser= async (req,res)=>{


  
  try{
const user= await User.findById(req.userId).select("-password -__v");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.status(200).json({user}); 

  }
  catch(err){
    console.error("Error fetching current user:", err);
    res.status(500).json({message:"Internal server error"});
    
  }
  } 

  export const updateProfile= async (req,res)=>{
    
    try {
      let {firstName, lastName, headline, location, userName, gender} = req.body;
       let skills= req.body.skills? JSON.parse(req.body.skills): [];
       let education= req.body.education? JSON.parse(req.body.education): [];   
        let experience= req.body.experience? JSON.parse(req.body.experience): [];

      let profileImage;
      let coverImage;
     console.log(req.files);
     if (req.files.profileImage) {
       profileImage= await uploadOnCloudinary(req.files.profileImage[0].path)
     }
      if (req.files.coverImage) {
        coverImage= await uploadOnCloudinary(req.files.coverImage[0].path)
      }
        
        const user = await User.findByIdAndUpdate(
          req.userId,
          {
            firstName,
            lastName,
            headline,
            location,
            userName,
            gender, skills, education, experience, profileImage, coverImage
     } ,{new:true}).select("-password -__v");
        
     return res.status(200).json( user);
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

 export const getprofile= async (req,res)=>{
  try{
      let {userName}=req.params
      let user=await User.findOne({userName}).select("-password")
      if(!user){
        return res.status(400).json({message:"userName does not exist"})
      }
      return res.status(200).json(user)
  }
  catch(err){
    console.log(err)
    return res.status(500).json({message: `get profile error ${err}` })

  }
 }

 export const search= async(req,res)=>{
       try{
        let{query}= req.query
        if(!query){
          return res.status(400).json({message:"query is required"})

        }
            let users= await User.find({
                $or:[
                  {firstName:{$regex:query,$options:"i"}},
                  {lastName:{$regex:query,$options:"i"}},
                  {UserName:{$regex:query,$options:"i"}},
                  {slills:{$in:[query]}}
                ]
            })
            return res.status(200).json(users)
       }
       catch(err){
            console.log(err)
    return res.status(500).json({message: `search error ${err}` })
       }
 }

 export const getSuggestedUser= async (req,res)=>{
  try{
    let currentUser=await User.findById(req.userId).select("connection")
       let suggestedUser= await User.find({
        _id:{
          
        $ne:currentUser, $nin: currentUser.connection
        }
       }).select("-password")
       return res.status(200).json(suggestedUser)
  } 
  catch(err){
    console.log(err)
    return res.status(500).json({message: ` suggested user error ${err}`} )

  }
 }