import Notification from "../models/notification.model.js";


export const getNotification =async(req,res)=>{
    try{
        const userId = req.user._id;
        const notification=await Notification.find({to:userId}).populate({
            path:"from",
            select:"username profileImge",
        });
        await Notification.updateMany({to:userId},{read:true});
        res.status(200).json(notification);
    }catch(error){
        console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
    
};

export const deleteNotifications = async(req,res)=>{
    try{
        const userId=req.user._id;
        await Notification.deleteMany({to:userId})
        res.status(200).json({message:"notifications deleted sucessfully"});
    }catch{
        console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
};