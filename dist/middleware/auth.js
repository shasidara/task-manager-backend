"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Please Login!" });
            return;
        }
        const decodedObj = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await userSchema_1.default.findById(decodedObj._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
    }
};
exports.default = userAuth;
