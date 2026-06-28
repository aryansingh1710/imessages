import dotenv from "dotenv";
dotenv.config();  
import express from "express";
import cors from "cors"

import fs from "fs"
import path from "path"


import {clerkMiddleware} from "@clerk/express"
import { connectDB } from "./lib/db.js";
import User from "./models/user.model.js";

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL=process.env.FRONTEND_URL;

const publicDir=path.join(process.cwd(),"public")

app.use(clerkMiddleware())

app.use(cors({origin:FRONTEND_URL,credentials:true}))

app.use(express.json())

app.get("/health",(req,res)=>{
    res.status(200).json({ok:true})
})

if(fs.existsSync(publicDir)){

    app.use(express.static(publicDir))

    app.get("/{*any}",(res,req,next)=>{
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    })
}

app.listen(PORT, async () => {
    await connectDB();  
    console.log(`Server is up and running on PORT: ${PORT}`);
    if (process.env.NODE_ENV === "production") job.start();
});
 