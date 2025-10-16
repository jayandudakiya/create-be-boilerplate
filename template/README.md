# Express Backend Boilerplate JS

## This project was generated using [create-be-boilerplate](https://github.com/jayandudakiya/create-be-boilerplate.git).

## 🚀 Getting Started

```bash
npm install
npm run dev
```

**Modular Node.js + Express backend boilerplate** with authentication, validation, file uploads, and utility helpers.

---

## Features

- Node.js + Express setup
- Modular folder structure:
  - `config/` - Configuration files (DB, API)
  - `constants/` - Application constants
  - `controllers/` - Request handlers
  - `middlewares/` - Auth, validation, error handling, file uploads
  - `models/` - Mongoose models
  - `routes/` - API routes
  - `services/` - Business logic layer
  - `utils/` - Utility helpers (JWT, cookies, hashing, crypto, email, responses)
  - `validations/` - Joi validation schemas
- User authentication with JWT
- Password hashing with bcrypt
- File uploads (images, backups)
- Error handling middleware
- Email sending via Gmail
- Logging with Morgan
- CORS and security setup with Helmet
- Ready-to-use environment config with `.env.example`

---

## Folder Structure

```
├── 📁 config/
│   ├── 📄 api.js
│   └── 📄 db.js
├── 📁 constants/
│   └── 📄 user.js
├── 📁 controllers/
│   └── 📄 user.controller.js
├── 📁 middlewares/
│   ├── 📄 auth.js
│   ├── 📄 authorizeRoles.js
│   ├── 📄 errorHandler.js
│   ├── 📄 fileRestoreUpload.js
│   ├── 📄 imageUpload.js
│   └── 📄 validate.js
├── 📁 models/
│   └── 📄 user.model.js
├── 📁 routes/
│   ├── 📄 health.routes.js
│   └── 📄 index.js
├── 📁 services/
│   └── 📄 user.service.js
├── 📁 utils/
│   ├── 📄 appError.js
│   ├── 📄 cookies.js
│   ├── 📄 cryptoHelper.js
│   ├── 📄 hash.js
│   ├── 📄 helper.js
│   ├── 📄 httpStatus.js
│   ├── 📄 jwt.js
│   ├── 📄 mongoErrorFormatter.js
│   ├── 📄 response.js
│   └── 📄 sendEmail.js
├── 📁 validations/
│   └── 📄 user.validation.js
├── 📄 app.js
└── 📄 server.js
```

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/backend-template-js.git
cd backend-template-js
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

- Copy .env.example to .env and fill in your values:

```ini
PORT=5000
HOST=localhost
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPT_SECRET_KEY=your_encryption_key
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
SALT_ROUNDS=10
```

4. **Available Scripts**

| Command        | Description                                 |
| :------------- | :------------------------------------------ |
| npm start      | Start the server in production mode         |
| npm run dev    | Start the server with nodemon (development) |
| npm run lint   | Run ESLint for code linting                 |
| npm run format | Format code with Prettier                   |
| npm test       | Run tests (if implemented)                  |

---

### Usage

- Server entry point: src/server.js

- App instance: src/app.js

- API prefix can be set in config/api.js

- Routes are organized in routes/

- Controllers handle requests, services contain business logic

- Middlewares include auth, validation, file uploads, and error handling

- Use validations/ for Joi schema validation

---

### Utilities

- utils/hash.js – Password hashing and comparison

- utils/cryptoHelper.js – Encrypt/decrypt sensitive data

- utils/cookies.js – Auth cookie helper

- utils/jwt.js – JWT generation and verification

- utils/sendEmail.js – Send emails using Gmail

- utils/response.js – Standard API response formatting

- utils/appError.js – Custom AppError class

---

## License

MIT License © 2025 [Jayan Dudakiya]

---

I can also make a **shorter, more visual version** with a diagram of your folder structure and usage examples so new developers can onboard faster.

Do you want me to create that visual README version too?
