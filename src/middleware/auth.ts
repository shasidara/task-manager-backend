import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            res.status(401).json({ message: "Please Login!" });
            return;
        }

        const decodedObj = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { _id: string };

        const user = await User.findById(decodedObj._id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        req.user = user;
        next();

    } catch(err) {
        if(err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
    }
};

export default userAuth;