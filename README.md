# 🚀 Backend Template (TypeScript + Express + Mongoose)

A clean and modern backend starter using **TypeScript**, **Express**, and **Mongoose**, designed to help you build scalable Node.js APIs fast.

---

## 🧩 Features

- ⚙️ TypeScript-based structure
- 🧱 Express with modular architecture
- 📦 Mongoose ORM for MongoDB
- 🔐 Ready for authentication (JWT + bcrypt)
- 🧰 Built-in utilities for response formatting and error handling
- 🌱 Pre-configured environment setup

---

## 📁 Folder Structure
```yml
src/
├── config/ # DB and environment setup
├── controllers/ # Business logic handlers
├── models/ # Mongoose models
├── routes/ # API route definitions
├── services/ # Database logic and helpers
├── utils/ # Common utilities (response handlers, etc.)
├── types/ # Shared TypeScript types
├── app.ts # Express app setup
└── server.ts # Server entry point
```

---

## ⚙️ Setup

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Create .env file

Copy .env.example and rename it to .env, then update values as needed.

### 3️⃣ Run in development
```bash
npm run dev
```
### 4️⃣ Build for production
```bash
npm run build
```

### 5️⃣ Start built version
```bash
npm start
```

## 🧠 Example Endpoints
```yml
Method	Endpoint	Description
GET	/	Health check
POST	/api/users	Create new user
GET	/api/users	Get all users
``` 

## 🧰 Tech Stack

- Node.js + Express

- TypeScript

- MongoDB + Mongoose

- Helmet, CORS, Morgan

- Dotenv for config management