import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import { addBookmark, getBookmark, removeBookmark } from "../controllers/user.controller.js";


const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.post("/bookmark/:jobId", isAuthenticated, addBookmark);
router.get("/bookmark", isAuthenticated, getBookmark);
router.delete("/bookmark/:jobId", isAuthenticated, removeBookmark);

export default router;

