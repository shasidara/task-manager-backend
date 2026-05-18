import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";

const authRouter = express.Router();


authRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: passwordHash });
        const savedUser = await user.save();

        
        const token = jwt.sign(
            { _id: savedUser._id, email: savedUser.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            sameSite: "none",  
            secure: true,      
        });

        res.status(201).json({
            message: "User registered successfully ✅",
            data: savedUser,
        });

    } catch(err) {
        if(err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
});

authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            sameSite: "none",  
            secure: true,      
        });

        res.json({
            message: "Login successful ✅",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch(err) {
        if(err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
    }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.json({ message: "Logged out successfully ✅" });
});

export default authRouter;