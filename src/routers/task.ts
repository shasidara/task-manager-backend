import express, { Request, Response} from "express";
import Task from "../models/taskSchema";
import userAuth from "../middleware/auth";
import { upload } from "../config/cloudinary";

const taskRouter = express.Router();

taskRouter.post("/task", userAuth, upload.array("attachments", 10), async (req: Request, res: Response) => {
    try{
        const { title, description, status, targetDate, priority, labels } = req.body;

        const files = req.files as Express.Multer.File[];
        const attachments = files?.map((file: any) => ({
            url: file.path,
            originalName: file.originalname,
            resourceType: file.resource_type || "auto",
        })) || [];

        const parsedLabels = labels ? typeof labels === "string" ? JSON.parse(labels) : labels : [];

        const task = new Task({
            title,
            description,
            status,
            targetDate,
            priority: priority || "medium",
            labels: parsedLabels,
            attachments,
        });

        const data = await task.save();
        res.json({message: "task saved successfully", data})
    }catch(err: any) {
        res.status(500).json({ message: err?.message || "Internal server error" });
    };
});

taskRouter.get("/all/tasks", userAuth, async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        const sort = req.query.sort as string;

        const query = search ? {
            $or: [
                {title: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}},
            ],
        } : {};

        const sortOrder = sort === "oldest" ? 1 : -1;
        
        const tasks = await Task.find(query).sort({ createdAt: sortOrder });

        res.json({ message: "Task fetched successfully",
            data: tasks
        });
    }catch (err) {
        if(err instanceof Error) {
            res.status(500).json({ message: err.message });
        };
    };
});

taskRouter.get("/single/task/:_id", userAuth, async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params._id);
        if(!task) {
            res.status(400).json({ message: "Task not found!" })
        }

        res.json({ message: "Task fetched successfully",
            data: task,
        });
    }catch(err) {
        if(err instanceof Error) {
            res.status(500).json({ message: err.message });
        };
    };
});

taskRouter.put("/update/task/:id",userAuth, upload.array("attachments", 10), async (req: Request, res: Response) => {
    try {
        const { title, description, status, targetDate, priority, labels, deletedAttachments } = req.body;

        if(!title) {
            res.status(400).json({ message: "Title is required "});
            return;
        };

        const files = req.files as Express.Multer.File[];
        const newAttachments = files?.map((file: any) => ({
            url: file.path,
            originalName: file.originalname,
            resourseType: file.resource_type || "auto",
        })) || [];

        const parsedLabels = labels ? typeof labels === "string" ? JSON.parse(labels) : labels : [];
        const parsedDeletedAttachments: string[] = deletedAttachments ? typeof deletedAttachments === "string" ? JSON.parse(deletedAttachments) : deletedAttachments : [];
        const existingTask = await Task.findById(req.params.id);
        if(!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const filteredAttachments = (existingTask.attachments || []).filter(
            (att) => !parsedDeletedAttachments.includes(att.url)
        );

        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            { 
                title, 
                description, 
                status,
                targetDate,
                priority,
                labels: parsedLabels,
                attachments: [...filteredAttachments, ...newAttachments],
            },
            { new: true, runValidators: true }
        );
        if(!updateTask){
            res.status(400).json("Task not found!");
            return;
        };

        res.json({
            message: "Task updated successfully",
            data: updateTask,
        });
    }catch (err) {
        if(err instanceof Error){
            res.status(500).json({ message: err.message});
        };
    };
});

taskRouter.delete("/delete/task/:id", userAuth, async (req: Request, res: Response) => {
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!deletedTask){
            res.status(404).json({ message: "Task not found!"});
        };

        res.json({
            message: "Task deleted successfully",
            data: deletedTask,
        });
    }catch(err) {
        if(err instanceof Error) {
            res.status(500).json({ message: err.message});
        };
    };
});

export default taskRouter;