import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createPost, getPost, like, comments  } from "../controllers/post.controller.js";


const postRouter= express.Router();

postRouter.post("/create", isAuth, upload.single("image"), createPost )
postRouter.get("/getpost", isAuth, getPost )
postRouter.get("/like/:id", isAuth, like)
postRouter.post("/comments/:id", isAuth, comments)
   


export default postRouter; 