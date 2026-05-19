import express, { Request, Response} from "express";
import Task from "../models/taskSchema";
import userAuth from "../middleware/auth";

const taskRouter = express.Router();

taskRouter.post("/task", userAuth, async (req: Request, res: Response) => {
    try{
        const { title, description, status, targetDate } = req.body;

        const task = new Task({
            title,
            description,
            status,
            targetDate: targetDate || null,
        });

        const data = await task.save();

        res.json({message: "task saved successfully", data})
    }catch(err) {
        if(err instanceof Error) {
            res.status(400).send("ERROR: " + err.message)
        } else{
            res.status(400).send("Unknown error");
        };
    };
});

taskRouter.get("/all/tasks", async (req: Request, res: Response) => {
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

taskRouter.get("/single/task/:_id", async (req: Request, res: Response) => {
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

taskRouter.put("/update/task/:id", async (req: Request, res: Response) => {
    try {
        const { title, description, status } = req.body;

        if(!title) {
            res.status(400).json({ message: "Title is required "});
            return;
        };

        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
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

taskRouter.delete("/delete/task/:id", async (req: Request, res: Response) => {
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