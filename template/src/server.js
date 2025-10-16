import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// --------------------------------
// Connect to database and start server
// --------------------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });
