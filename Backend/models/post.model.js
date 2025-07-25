import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  },
  description:{
    type: String, 
    default: ""
  },
  image:{
    type: String,
    
  },
  like: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      required: true
    }
  
  }]

},{timestamps:true})

const Post= mongoose.model("Post", postSchema);
export default Post;