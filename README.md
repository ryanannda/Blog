# Full Stack Blog CMS

A modern full stack Blog Content Management System built with React,
TypeScript, Node.js, Express, and PostgreSQL.

## 🚀 Features

-   Authentication (Login & Register)
-   Role Based Access (Admin & User)
-   CRUD Blog Posts (Admin)
-   Nested Comments & Replies
-   Edit & Delete Comments (Role-based)
-   Modern UI with Tailwind & shadcn/ui
-   RESTful API Architecture

## 🧱 Tech Stack

### Frontend

-   React + TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   Lucide React Icons

### Backend

-   Node.js
-   Express.js
-   PostgreSQL
-   node-postgres (pg)

## 🔐 Authentication

-   Custom authentication system
-   Role-based authorization
-   Admin & User roles

## 🗄️ Database Tables

### users

-   id
-   username
-   password_hash
-   role

### posts

-   id
-   title
-   slug
-   excerpt
-   content
-   category
-   featured_image
-   author_name
-   created_at
-   updated_at

### comments

-   id
-   post_id
-   user_id
-   parent_id
-   content
-   created_at

## 📡 API Endpoints

### Auth

POST /api/auth/login\
POST /api/auth/register

### Posts

GET /api/posts\
POST /api/posts\
PUT /api/posts/:id\
DELETE /api/posts/:id

### Comments

GET /api/posts/:id/comments\
POST /api/posts/:id/comments\
PUT /api/comments/:id\
DELETE /api/comments/:id

## ⚙️ Setup Instructions

### Backend

``` bash
cd backend
npm install
npm run dev
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

## 🏆 Highlights

-   Nested comment system with recursion
-   Role-based UI & permissions
-   Clean modern UI
-   Real relational database
-   Production-style REST API

## 📸 Screenshots

(Add screenshots here)

## 👨‍💻 Author

Riyan Ananda Pradipta\
Full Stack Developer & UI/UX Designer

------------------------------------------------------------------------

This project is suitable for portfolio, learning full stack development,
and real-world CMS use cases.
