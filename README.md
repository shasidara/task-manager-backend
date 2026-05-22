# 📝 Task Manager Backend

A RESTful API built with Node.js, Express.js, TypeScript and MongoDB for the Task Manager application.

## 🚀 Live URL

```
https://task-manager-backend-9zmt.onrender.com
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Cookie handling |
| CORS | Cross origin requests |
| dotenv | Environment variables |

## 📁 Folder Structure

```
task-manager-backend/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication middleware
│   ├── models/
│   │   ├── taskSchema.ts     # Task model
│   │   └── userSchema.ts     # User model
│   ├── routers/
│   │   ├── auth.ts           # Auth routes
│   │   └── task.ts           # Task routes
│   └── app.ts                # Entry point
├── .env                      # Environment variables
├── tsconfig.json             # TypeScript config
└── package.json
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/taskmanager
PORT=5000
JWT_SECRET=your_secret_key_here
```

## 🏃 Running Locally

```bash
# Clone the repository
git clone https://github.com/shasidara/task-manager-backend.git

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /signup | Register new user | No |
| POST | /login | Login user | No |
| POST | /logout | Logout user | No |
| GET | /profile | Get current user | Yes |

### Task Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/task | Create new task | Yes |
| GET | /api/tasks | Get all tasks | Yes |
| GET | /single/task/:id | Get single task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |

### Query Parameters

```
GET /api/tasks?search=nodejs        # Search tasks by title or description
GET /api/tasks?sort=latest          # Sort by latest (default)
GET /api/tasks?sort=oldest          # Sort by oldest
GET /api/tasks?search=node&sort=oldest  # Combine search and sort
```

## 📦 Request & Response Examples

### POST /signup
```json
// Request Body
{
    "name": "Shasidara",
    "email": "shasidara@gmail.com",
    "password": "Test@123"
}

// Response
{
    "message": "User registered successfully ✅",
    "data": {
        "_id": "...",
        "name": "Shasidara",
        "email": "shasidara@gmail.com"
    }
}
```

### POST /login
```json
// Request Body
{
    "email": "shasidara@gmail.com",
    "password": "Test@123"
}

// Response
{
    "message": "Login successful ✅",
    "data": {
        "_id": "...",
        "name": "Shasidara",
        "email": "shasidara@gmail.com"
    }
}
```

### POST /api/task
```json
// Request Body
{
    "title": "Build Task Manager",
    "description": "Complete MERN stack project",
    "status": "in-progress",
    "targetDate": "2026-05-25"
}

// Response
{
    "message": "Task saved successfully ✅",
    "data": {
        "_id": "...",
        "title": "Build Task Manager",
        "description": "Complete MERN stack project",
        "status": "in-progress",
        "targetDate": "2026-05-25T00:00:00.000Z",
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

### PUT /api/tasks/:id
```json
// Request Body
{
    "title": "Build Task Manager",
    "description": "Updated description",
    "status": "done",
    "targetDate": "2026-05-25"
}

// Response
{
    "message": "Task updated successfully ✅",
    "data": { ... }
}
```

### DELETE /api/tasks/:id
```json
// Response
{
    "message": "Task deleted successfully ✅",
    "data": { ... }
}
```

## 🔐 Authentication Flow

1. User signs up → password hashed with bcrypt → saved to MongoDB
2. User logs in → password compared with bcrypt → JWT token generated
3. JWT token stored as HTTP-only cookie (sameSite: none, secure: true)
4. Protected routes use `userAuth` middleware to verify token
5. Middleware extracts user ID from token → fetches user → attaches to `req.user`
6. Logout clears the cookie

## 🗄️ Database Schemas

### User Schema
```ts
{
    name: String (required, min: 3, max: 50)
    email: String (required, unique, lowercase)
    password: String (required, min: 6)
    createdAt: Date (auto)
    updatedAt: Date (auto)
}
```

### Task Schema
```ts
{
    title: String (required, min: 3, max: 100)
    description: String (max: 500)
    status: String (enum: todo | in-progress | done, default: todo)
    targetDate: Date (optional)
    createdAt: Date (auto)
    updatedAt: Date (auto)
}
```

## 🚀 Deployment

- Platform: **Render** (Free tier)
- Database: **MongoDB Atlas** (Free tier)
- Auto deploys on push to `main` branch

## 👨‍💻 Developer

Shasidara C — Full Stack Developer
