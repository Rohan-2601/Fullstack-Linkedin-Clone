import express from "express"
import { getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection,  acceptConnection } from "../controllers/connection.controllers.js"
import isAuth from "../middleware/isAuth.js"


let connectionRouter= express.Router()

connectionRouter.post("/send/:id", isAuth, sendConnection)

connectionRouter.put("/accept/:connectionId", isAuth,  acceptConnection)

connectionRouter.put("/reject/:connectionId", isAuth, rejectConnection)

connectionRouter.get("/getstatus/:userId", isAuth, getConnectionStatus)

connectionRouter.delete("/remove/:userId", isAuth, removeConnection)

connectionRouter.get("/requests", isAuth, getConnectionRequests)

connectionRouter.get("/", isAuth, getUserConnections)


export default connectionRouter