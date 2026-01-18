import express from 'express';
import {
    login,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../../../controllers/admin/users/users.controller.js";

// Router
const router = express.Router();

router.post("/login", login);
router.get("/getUsers", getUsers)
router.get("/getUserByID/:id", getUserById)
router.post("/createUser", createUser)
router.put("/updateUser", updateUser)
router.delete("/deleteUser/:id", deleteUser)

export default router;