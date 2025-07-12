[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19872925&assignment_repo_type=AssignmentRepo)
# MERN Stack Integration Assignment

This assignment focuses on building a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates seamless integration between front-end and back-end components.

## Assignment Overview

You will build a blog application with the following features:
1. RESTful API with Express.js and MongoDB
2. React front-end with component architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization
5. Advanced features like image uploads and comments

## Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── uploads/            # Uploaded images
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week4-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Setup Instructions

### Server
```bash
cd server
cp .env.example .env # Edit with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Client
```bash
cd client
cp .env.example .env # Edit if needed
npm install
npm run dev
```

## API Documentation

### Posts
- `GET /api/posts` — List posts (supports `?page`, `?limit`, `?q` for search)
- `GET /api/posts/:id` — Get single post
- `POST /api/posts` — Create post (auth required)
- `PUT /api/posts/:id` — Update post (auth required)
- `DELETE /api/posts/:id` — Delete post (auth required)
- `POST /api/posts/upload-image` — Upload image (auth required)
- `POST /api/posts/:id/comments` — Add comment (auth required)

### Categories
- `GET /api/categories` — List categories
- `POST /api/categories` — Create category (auth required)

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login

## Features Implemented
- User registration and login (JWT authentication)
- Protected routes for creating/editing/deleting posts
- Image upload for blog posts
- Pagination and search for posts
- Comments on posts
- Form validation and error handling
- Responsive UI with Tailwind CSS

## Screenshots

> Add screenshots of your application here (main views, features, etc.)

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)