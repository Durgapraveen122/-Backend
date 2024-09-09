import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost , deletePost,commentOnPost,likeunlikePOst, getAllPosts,getFollowingPosts ,getUserPosts} from "../controllers/post.controller.js";

const router=express.Router();

router.post("/create",protectRoute,createPost);
router.delete("/delete/:id",protectRoute, deletePost);
router.post("/comment/:id",protectRoute,commentOnPost );
router.post("/like/:id",protectRoute,likeunlikePOst);
router.get("/all",protectRoute, getAllPosts);
router.get("/following",protectRoute, getFollowingPosts);3
router.get("/user/:username",protectRoute, getUserPosts);

export default router;