"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_1 = __importDefault(require("./config/database"));
const task_1 = __importDefault(require("./routers/task"));
const user_1 = __importDefault(require("./routers/user"));
const profile_1 = __importDefault(require("./routers/profile"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/", task_1.default);
app.use("/", user_1.default);
app.use("/", profile_1.default);
(0, database_1.default)().then(() => {
    console.log("Database is connected successfully");
    app.listen(process.env.PORT, () => {
        console.log("Server running on port 5000 ✅");
    });
}).catch((err) => {
    console.error("Database is not connected", err);
});
