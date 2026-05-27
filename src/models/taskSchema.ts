import mongoose, { Schema, Document } from "mongoose";

export interface ITASK extends Document{
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    targetDate: Date;
    priority: "low" | "medium" | "high";
    labels: string[];
    attachments: { url: string; originalName: string; resourceType: string }[];
    createdAt: Date;
    updatedAt: Date;
};

const taskSchema = new Schema<ITASK>({
    title: { 
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 100
    },

    description: { 
        type: String, 
        maxlength: 500 
    },

    status: {
        type: String,
        enum: [ "todo", "in-progress", "done" ],
        default: "todo",
    },

    targetDate: {
        type: Date,
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },

    labels: {
        type: [String],
        default: [],
    },

    attachments: {
        type: [
            {
                url: { type: String, required: true },
                originalName: { type: String, required: true },
                resourceType: { type: String, default: "auto" },
            },
        ],
        default: []
    },
}, {
    timestamps: true
});

export default mongoose.model<ITASK>("Task", taskSchema);