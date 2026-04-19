import { Router } from 'express';
import { getAdminStats, getRevenueAnalytics, getPilots, createPilot, assignPilot } from '../../controllers/adminController';
import { verifyJWT } from '../../middleware/verifyJWT';
import { isAdmin } from '../../middleware/isAdmin';

const router = Router();

router.use(verifyJWT);
router.use(isAdmin); // Ensure all routes below are only for admins

router.get('/stats', getAdminStats);
router.get('/revenue', getRevenueAnalytics);
router.get('/pilots', getPilots);
router.post('/pilots', createPilot);
router.post('/assign', assignPilot);

export default router;
