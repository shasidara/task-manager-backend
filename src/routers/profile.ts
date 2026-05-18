import express, { Request, Response } from "express";
import userAuth from "../middleware/auth";

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req: Request, res: Response) => {
    try{
        res.json({
            message: "Profile fetched successfully",
            data: req.user
        });
    }catch(err) {
        if(err instanceof Error){
            res.status(500).json({ message: err.message });
        };
    };
});


export default profileRouter;