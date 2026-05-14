import express, { Request, Response} from "express";
import Task from "../models/taskSchema";

const taskRouter = express.Router();

taskRouter.post("/task", async (req: Request, res: Response) => {
    try{
        const { title, description, status } = req.body;

        const task = new Task({
            title,
            description,
            status,
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

export default taskRouter;