import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { connect } from "mongoose";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from './routes/post.routes.js';
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import  { Server } from "socket.io"
import notificationRouter from "./routes/notification.routes.js";

let app = express();
 let server=http.createServer(app);
export const io= new Server(server,{
      cors:({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
      })
 })
app.use(express.json());
app.use(cookieParser());  
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
let port=process.env.PORT ;
 
app.use("/api/auth", authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter )
app.use("/api/connection",connectionRouter )
app.use("/api/notification", notificationRouter )
export const userSocketMap=new Map()

io.on("connection", (socket)=>{
  console.log("user connected", socket.id)
  socket.on("register",(userId)=>{
      userSocketMap.set(userId,socket.id)
  })

  socket.on("disconect", (socket)=>{
    console.log("user disconnected", socket.id)
  })
})


server.listen(port, () => {
  connectDb();
  console.log("Server is running on port ",port);
});