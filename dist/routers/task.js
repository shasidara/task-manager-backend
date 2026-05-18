"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskSchema_1 = __importDefault(require("../models/taskSchema"));
const auth_1 = __importDefault(require("../middleware/auth"));
const taskRouter = express_1.default.Router();
taskRouter.post("/task", auth_1.default, async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = new taskSchema_1.default({
            title,
            description,
            status,
        });
        const data = await task.save();
        res.json({ message: "task saved successfully", data });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).send("ERROR: " + err.message);
        }
        else {
            res.status(400).send("Unknown error");
        }
        ;
    }
    ;
});
taskRouter.get("/all/tasks", async (req, res) => {
    try {
        const search = req.query.search;
        const query = search ? {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ],
        } : {};
        const tasks = await taskSchema_1.default.find(query).sort({ createdAt: -1 });
        res.json({ message: "Task fetched successfully",
            data: tasks
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
taskRouter.get("/single/task/:_id", async (req, res) => {
    try {
        const task = await taskSchema_1.default.findById(req.params._id);
        if (!task) {
            res.status(400).json({ message: "Task not found!" });
        }
        res.json({ message: "Task fetched successfully",
            data: task,
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
taskRouter.put("/update/task/:id", async (req, res) => {
    try {
        const { title, description, status } = req.body;
        if (!title) {
            res.status(400).json({ message: "Title is required " });
            return;
        }
        ;
        const updateTask = await taskSchema_1.default.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true, runValidators: true });
        if (!updateTask) {
            res.status(400).json("Task not found!");
            return;
        }
        ;
        res.json({
            message: "Task updated successfully",
            data: updateTask,
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
taskRouter.delete("/delete/task/:id", async (req, res) => {
    try {
        const deletedTask = await taskSchema_1.default.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            res.status(404).json({ message: "Task not found!" });
        }
        ;
        res.json({
            message: "Task deleted successfully",
            data: deletedTask,
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
exports.default = taskRouter;
