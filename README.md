## 🚀 Backend Template (JavaScript + Express + Mongoose)

A clean and modern backend starter using **JavaScript**, **Express**, and **Mongoose**, designed to help you build scalable Node.js APIs fast.

---

# 🚀 Usage & ⚙️ Setup

### use to initialed project 

```bash
npx create-be-boilerplate my-app
```

### 1️⃣ Install dependencies

```bash
cd my-app

npm install
```

### 2️⃣ Update .env and configs file
**1. Create your environment file**

 - Copy the example file and rename it:

```bash
cp .env.example .env
```
**2. Update your `app.js` configuration**

 - If your app.js currently loads:

```bash
dotenv.config({ path: ".env" });
```
- Replace it with one of these options:

> Option A — Load the .env file explicitly
```bash
dotenv.config({ path: ".env" });
```
> Option B — Let dotenv load .env automatically (recommended)

```bash
dotenv.config();
```
**Your application will now read all environment variables from the newly created `.env` file.**

### 3️⃣ Run in development
```bash
npm run dev
```

## 🧠 Example Endpoints

| Method | Endpoint | Description |
|---------|-------------|-------------|
| **GET** | /  | Health check |
| **POST** | api/auth/register  | To create new user |
| **GET** | api/users | Get all users|

---

## 🧩 Features

- ⚙️ JavaScript-based structure
- 🧱 Express with modular architecture
- 📦 Mongoose ORM for MongoDB
- 🔐 Ready for authentication with refresh token and access token feature (JWT + bcrypt)
- 🧰 Built-in utilities for response formatting and error handling
- 🌱 Pre-configured environment setup

---

## 📁 Folder Structure

```yml
├── 📁 template (my-app folder)
│   ├── 📁 public
│   │   └── 📁 images
│   │       └── 🖼️ test.png
│   ├── 📁 src
│   │   ├── 📁 config                   # DB and environment setup (db.js, api config, dotenv)
│   │   │   ├── 📄 api.js               # API configuration / constants
│   │   │   └── 📄 db.js                # Database connection logic (Mongoose)
│   │   ├── 📁 constants                # Static constants, enums, fixed values
│   │   │   └── 📄 user.js              # User-related constant values
│   │   ├── 📁 controllers              # Business logic controllers
│   │   │   ├── 📄 auth.controller.js   # Auth logic (register, login, refresh, logout)
│   │   │   └── 📄 user.controller.js   # User CRUD and profile handlers
│   │   ├── 📁 middlewares              # Custom middleware functions
│   │   │   ├── 📄 auth.js              # Auth verification middleware
│   │   │   ├── 📄 authorizeRoles.js    # RBAC: role-based access control
│   │   │   ├── 📄 errorHandler.js      # Global error handler middleware
│   │   │   ├── 📄 fileRestoreUpload.js # Restore uploaded file if failure occurs
│   │   │   ├── 📄 imageUpload.js       # Image upload helper (multer / sharp)
│   │   │   └── 📄 validate.js          # Request validation handler
│   │   ├── 📁 models                   # Mongoose schemas and models
│   │   │   └── 📄 user.model.js        # User schema definition
│   │   ├── 📁 routes                   # API route definitions
│   │   │   ├── 📄 auth.routes.js       # Auth API routes
│   │   │   ├── 📄 health.routes.js     # Server health check route
│   │   │   └── 📄 index.js             # Route aggregator
│   │   ├── 📁 services                 # Database access & domain logic
│   │   │   └── 📄 user.service.js      # User model service (DB queries)
│   │   ├── 📁 utils                    # Helper utilities & shared logic
│   │   │   ├── 📄 appError.js          # Custom error constructor
│   │   │   ├── 📄 cookies.js           # Cookie utilities
│   │   │   ├── 📄 cryptoHelper.js      # Encryption / random utilities
│   │   │   ├── 📄 hash.js              # Password hashing / comparing
│   │   │   ├── 📄 helper.js            # General-purpose helper functions
│   │   │   ├── 📄 httpStatus.js        # Status code + messages map
│   │   │   ├── 📄 jwt.js               # JWT generation + verification utils
│   │   │   ├── 📄 mongoErrorFormatter.js # MongoDB error beautifier
│   │   │   ├── 📄 response.js          # Standard API response builder
│   │   │   └── 📄 sendEmail.js         # Email sender wrapper (nodemailer)
│   │   ├── 📁 validations              # Payload / schema validators
│   │   │   ├── 📄 common.validation.js # Common reusable validation schemas
│   │   │   └── 📄 user.validation.js   # User input validations
│   │   ├── 📄 app.js                   # Express app setup (middleware, routes)
│   │   └── 📄 server.js                # App entry point (starts the server)
│   ├── ⚙️ .env.example                 # Example environment template
│   ├── ⚙️ .gitignore                  # Files ignored by Git
│   ├── ⚙️ .prettierrc                 # Prettier formatting rules
│   ├── 📝 README.md                   # Documentation for the boilerplate
│   ├── 📄 eslint.config.js            # ESLint configuration
│   ├── ⚙️ package.json                # Project dependencies & scripts
│   └── ⚙️ vercel.json                 # Vercel deployment config
```

## 🧰 Tech Stack

- Node.js + Express

- JavaScript

- MongoDB + Mongoose

- Helmet, CORS, Morgan

- Dotenv for config management