import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";


export const createPost = async (req, res) => {
  try{
    let {description} = req.body;
    let newPost;
    if(req.file) {
      let image = await uploadOnCloudinary(req.file.path);
        newPost = await Post.create({
          author: req.userId,
         description,
         image,
      })
    } else{
        newPost = await Post.create({
           author: req.userId, 
        description,
      });
    }
    return res.status(201).json(newPost)

  }
  catch (err) {
    return res.status(500).json(`create post error: ${err}`);

  }
}

export const getPost = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", "firstName lastName headline profileImage userName ")
      .populate("comments.user", "firstName lastName profileImage") // ✅ THIS LINE ADDED
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(`Error fetching posts: ${err}`);
  }
};


export const like = async (req, res) =>{
  try{
    let postId = req.params.id;
    let userId= req.userId;
    let post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({message: "Post not found"});
    }
    if(post.like.includes(userId)){
      // User already liked the post, so we remove the like
      post.like = post.like.filter(id => id.toString() !== userId);
    } else {
      // User has not liked the post, so we add the like
      post.like.push(userId);
      if(post.author.toString() != userId.toString()) {
      let notification=await Notification.create({
            receiver:post.author,
            type:"like",
            relatedUser:userId,
            relatedPost:postId
      })
    }
    }
    await post.save();
    io.emit("likeUpdated",{postId,likes:post.like})
     
    return res.status(200).json({message: "Post liked/unliked successfully", post});

  }
  catch (err) {
    return res.status(500).json(`Error liking post: ${err}`);
  }
}


export const comments = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    // Step 1: Push the comment
    await Post.updateOne(
      { _id: postId },
      {
        $push: {
          comments: { user: userId, content }
        }
      }
    );

    // Step 2: Fetch updated post with populated comments
    const post = await Post.findById(postId)
      .populate("author", "firstName lastName profileImage headline userName ")
      .populate("comments.user", "firstName lastName profileImage");
         
        if(post.author.toString()!=userId.toString()) {
      let notification=await Notification.create({
            receiver:post.author,
            type:"comment",
            relatedUser:userId,
            relatedPost:postId
      })
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    io.emit("commentAdded",{postId,comm:post.comments})

    

    return res.status(200).json({
      message: "Comment added successfully",
      post
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
