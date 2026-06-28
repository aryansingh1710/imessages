import dotenv from "dotenv";
dotenv.config();  
import express from "express";
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import { connectDB } from "./lib/db.js";
import User from "./models/user.model.js";

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL=process.env.FRONTEND_URL

app.use(clerkMiddleware())

app.use(cors({origin:FRONTEND_URL,credentials:true}))

app.use(express.json())

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true})
})

app.listen(PORT, async () => {
    await connectDB();  
    console.log(`Server is up and running on PORT: ${PORT}`);
});
 