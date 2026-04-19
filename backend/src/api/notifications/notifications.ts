import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../../controllers/notificationController';
import { verifyJWT } from '../../middleware/verifyJWT';

const router = Router();

router.use(verifyJWT);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

export default router;
