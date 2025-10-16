import express from 'express';
import HTTP_STATUS from '../utils/httpStatus.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: HTTP_STATUS['200_MESSAGE'],
  });
});

export default router;
