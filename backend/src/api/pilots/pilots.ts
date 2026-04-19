import { Router } from 'express';
import { listPilots } from '../../controllers/pilotsController';
import { verifyJWT } from '../../middleware/verifyJWT';

const router = Router();

router.use(verifyJWT);
router.get('/', listPilots);

export default router;
