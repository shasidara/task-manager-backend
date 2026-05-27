# 📝 Task Manager Backend

A RESTful API built with Node.js, Express.js, TypeScript and MongoDB for the Task Manager application.

## 🚀 Live URL

```
https://task-manager-backend-9zmt.onrender.com
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Cookie handling |
| Multer | File upload handling |
| Cloudinary | File storage (images, documents, any file) |
| CORS | Cross origin requests |
| dotenv | Environment variables |

## 📁 Folder Structure

```
task-manager-backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   └── cloudinary.ts     # Cloudinary + Multer config
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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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
|--------|----------|-------------|---------------|
| POST | /task | Create new task (multipart/form-data) | Yes |
| GET | /all/tasks | Get all tasks | Yes |
| GET | /single/task/:id | Get single task | Yes |
| PUT | /update/task/:id | Update task (multipart/form-data) | Yes |
| DELETE | /delete/task/:id | Delete task | Yes |

### Query Parameters

```
GET /all/tasks?search=nodejs          # Search tasks by title or description
GET /all/tasks?sort=latest            # Sort by latest (default)
GET /all/tasks?sort=oldest            # Sort by oldest
GET /all/tasks?search=node&sort=oldest  # Combine search and sort
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

### POST /task (multipart/form-data)

title        = "Build Task Manager"
description  = "Complete MERN stack project"
status       = "in-progress"
targetDate   = "2026-05-25"
priority     = "high"
labels       = ["Urgent", "Feature"]
attachments  = (file) screenshot.png

```json
// Response
{
    "message": "task saved successfully",
    "data": {
        "_id": "...",
        "title": "Build Task Manager",
        "description": "Complete MERN stack project",
        "status": "in-progress",
        "targetDate": "2026-05-25T00:00:00.000Z",
        "priority": "high",
        "labels": ["Urgent", "Feature"],
        "attachments": [
            {
                "url": "https://res.cloudinary.com/...",
                "originalName": "screenshot.png",
                "resourceType": "auto"
            }
        ],
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```
## 🔐 Authentication Flow

1. User signs up → password hashed with bcrypt → saved to MongoDB
2. User logs in → password compared with bcrypt → JWT token generated
3. JWT token stored as HTTP-only cookie (sameSite: none, secure: true)
4. Protected routes use userAuth middleware to verify token
5. Middleware extracts user ID from token → fetches user → attaches to req.user
6. Logout clears the cookie

## 🗄️ Database Schemas

### User Schema

name        String (required, min: 3, max: 50)
email       String (required, unique, lowercase)
password    String (required, min: 6)
createdAt   Date (auto)
updatedAt   Date (auto)

### Task Schema

title         String   (required, min: 3, max: 100)
description   String   (max: 500)
status        String   (enum: todo | in-progress | done, default: todo)
targetDate    Date     (optional)
priority      String   (enum: low | medium | high, default: medium)
labels        String[] (default: [])
attachments   Array    (url, originalName, resourceType)
createdAt     Date     (auto)
updatedAt     Date     (auto)

## 📁 File Upload

- Handled by **Multer** + **Cloudinary**
- Accepts any file type (images, PDFs, documents, etc.)
- Max **10 files** per task
- Files stored in Cloudinary under `task-manager/` folder
- File URLs saved in MongoDB as part of the task document

## 🚀 Deployment

- Platform: Render (Free tier)
- Database: MongoDB Atlas (Free tier)
- File Storage: Cloudinary (Free tier)
- Auto deploys on push to main branch

## 👨‍💻 Developer
Shasidara C — Full Stack Developer
