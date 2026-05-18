"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 100,
        default: "",
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo",
    },
}, {
    timestamps: true
});
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;
