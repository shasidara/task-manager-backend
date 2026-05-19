import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
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
    targetDate: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
export default Task;