import { Router } from 'express';
import {
  createBooking,
  listBookings,
  updateBooking,
  assignPilot,
  pilotUpdateMission,
} from '../../controllers/bookingController';
import { verifyJWT } from '../../middleware/verifyJWT';
import { isAdmin } from '../../middleware/isAdmin';
import { isPilot } from '../../middleware/isPilot';

const router = Router();

// All routes require a valid JWT
router.use(verifyJWT);

// Customer: create a booking
router.post('/', createBooking);

// Admin / Pilot / Customer: list bookings (filtered by role in controller)
router.get('/', listBookings);

// Admin: approve / reject / change status
router.patch('/:id', isAdmin, updateBooking);

// Admin: assign a pilot to a booking
router.post('/:id/assign-pilot', isAdmin, assignPilot);

// Pilot: start or complete an assigned mission
router.patch('/:id/mission-update', isPilot, pilotUpdateMission);

export default router;
