"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const authRouter = express_1.default.Router();
authRouter.post("/signup", async (req, res) => {
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
        const existingUser = await userSchema_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = new userSchema_1.default({ name, email, password: passwordHash });
        const savedUser = await user.save();
        const token = jsonwebtoken_1.default.sign({ _id: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET, { expiresIn: "8h" });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(201).json({
            message: "User registered successfully ✅",
            data: savedUser,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "8h" });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            sameSite: "lax",
        });
        res.json({
            message: "Login successful ✅",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
    }
});
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.json({ message: "Logged out successfully ✅" });
});
exports.default = authRouter;
