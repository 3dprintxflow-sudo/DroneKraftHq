import { Router } from 'express';
import { getProfile, updateProfile } from '../../controllers/usersController';
import { verifyJWT } from '../../middleware/verifyJWT';

const router = Router();

router.use(verifyJWT);
router.get('/me', getProfile);
router.patch('/me', updateProfile);

export default router;
