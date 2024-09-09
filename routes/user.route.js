import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followunfollowuser,getSuggestedUser,getUserProfile,updateUser } from "../controllers/user.controller.js";


const router=express.Router();

router.get("/profile/:username",protectRoute,getUserProfile);
router.get("/suggested",protectRoute,getSuggestedUser);
router.post("/follow/:id",protectRoute,followunfollowuser);
router.post("/update",protectRoute,updateUser);


export default router;
