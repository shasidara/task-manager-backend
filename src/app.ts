import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database";
import taskRouter from "./routers/task";
import authRouter from "./routers/user";
import profileRouter from "./routers/profile";

const app = express();

app.use(cors({
    origin: [
        "https://task-manager-web-sable.vercel.app", 
        "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", taskRouter);
app.use("/", authRouter);
app.use("/", profileRouter);

connectDB().then(() => {
    console.log("Database is connected successfully");
    app.listen(process.env.PORT, () => {
        console.log("Server running on port 5000 ✅");
    });
}).catch((err) => {
    console.error("Database is not connected", err);
});