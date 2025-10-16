import express from 'express';
import healthRoutes from './health.routes.js';
import { API_END_POINT_PREFIX } from '../config/api.js';

const router = express.Router();

router.use(API_END_POINT_PREFIX.HEALTH_CHECK, healthRoutes);

export default router;
