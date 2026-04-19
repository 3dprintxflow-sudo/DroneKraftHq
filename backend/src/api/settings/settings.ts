import { Router } from 'express';
import { getSettings, updateSettings } from '../../controllers/settingsController';
import { verifyJWT } from '../../middleware/verifyJWT';

const router = Router();

router.use(verifyJWT);
router.get('/', getSettings);
router.patch('/', updateSettings);

export default router;
