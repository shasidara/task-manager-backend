"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const profileRouter = express_1.default.Router();
profileRouter.get("/profile", auth_1.default, async (req, res) => {
    try {
        res.json({
            message: "Profile fetched successfully",
            data: req.user
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        ;
    }
    ;
});
exports.default = profileRouter;
