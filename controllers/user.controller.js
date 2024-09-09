import bcrypt from "bcryptjs";
import {v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile=async(req,res)=>{
    const {username}=req.params;
    try{
        const user=await User.findOne({username}).select("-password");
        if(!user) return res.status(404).json({message:"user not found"});
        res.status(200).json(user);
    }catch (error){
        console.log("error in grtUserProfile",error.message);
        res.status(500).json({error:error.message});
    }
};
export const followunfollowuser=async(req,res)=>{
    try{
        const {id}=req.params;
        const userToModify=await User.findById(id);
        const currentUser=await User.findById(req.user._id);
        if(id ===req.user._id.toString()){
            return res.status(400).json({error:"you can not follow/unfollow yourself"})
        }
        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

        const isFollowing=currentUser.following.includes(id);

        if(isFollowing){
            //unfollow the user
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
            res.status(200).json({message:"user unfollowed sucessfully"});
        }
        else{
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
            //send notification to users
            const newNotification= new Notification({
                type:"follow",
                from:req.user._id,
                to:userToModify._id,
            });
            await newNotification.save();

            res.status(200).json({message:"user followed sucessfully"});
            
        }
    }catch (error){
        console.log("error in folllowiunfollowuser:",error.message);
        res.status(500).json({error:error.message});
    

    }
};

export const getSuggestedUser= async(req,res)=>{
    try{
        const userId = req.user._id;
        const userFolloedByMe = await User.findById(userId).select("following");
        const users=await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId},
                },
            },
            {$sample:{size:10}},
        ]);
        const filteredUsers = users.filter((user)=>!userFolloedByMe.following.includes(user._id));
        const suggestedUsers=filteredUsers.slice(0,4);
        suggestedUsers.forEach((user)=>(user.password=null));
        res.status(200).json(suggestedUsers);
    }catch(error){
        console.log("error in getsuggestedUser:",error.message);
        res.status(500).json({error:error.message});
    }
}
export const updateUser = async(req,res)=>{
    const {fullName,email,username,currentPasword,newPassword,bio,link }=req.body;
    let {profileImg}=req.body;
    const userId=req.user._id;

    try{
        let user=await User.findById(userId);
        if(!user) return res.status(404).json({message:"user not found"});
        
        if((!newPassword && currentPasword)|| (!currentPasword && newPassword)) {
            return res.status(400).json({error:"please provide both current and new password"});
        }
        if (currentPasword && newPassword){
            const isMatch = await bcrypt.compare(currentPasword,user.password);
            if(!isMatch) return res.status(400).json({error:"current password is wrong/incorrect"});
            if(newPassword.length<6){
            return res.status(400).json({error:"password length  must be least 6 charactrs long"})
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword,salt);
        }
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg=uploadedResponse.secure_url;
        }
        user.fullName=fullName||user.fullName;
        user.email=email|| user.email;
        user.username=username||user.username;
        user.bio=bio||user.bio;
        user.link=link||user.link;
        user.profileImg=profileImg||user.profileImg;

        user =await user.save();
        user.password=null;
        return res.status(200).json(user);

    }catch(error){
        console.log("error in updateUser:",error.message);
        res.status(500).json({error:error.message});
    }
};