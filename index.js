import express from 'express';
import dotenv from "dotenv"
const app=express();
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import {v2 as cloudinary} from "cloudinary";
dotenv.config();

cloudinary.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));


//home page
app.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
})


/*
app.get('/',(req,res)=>{
    res.status(200).send('<h1> this is express js<h1>')
})

*/

app.use(express.json());//to parse req.body
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/notification',notificationRoutes);

app.listen(5050,()=>{

    console.log('server has started')
    connectMongoDB();
})