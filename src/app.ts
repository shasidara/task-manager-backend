import express, { Request, Response } from "express";
import connectDB from "./config/database";

const app = express();
app.use(express.json());

import taskRouter from "./routers/task";

app.use("/", taskRouter);

connectDB().then(() => {
    console.log("Database is connected successfully");
    app.listen(5000, () => {
        console.log("Server is successfully listen on path 5000...")
    });
}).catch((err) => {
    console.error("Database is not connected", err);
});