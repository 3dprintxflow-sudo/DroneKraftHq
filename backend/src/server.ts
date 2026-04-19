import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth/auth';
import bookingsRoutes from './api/bookings/bookings';
import servicesRoutes from './api/services/services';
import usersRoutes from './api/users/users';
import notificationsRoutes from './api/notifications/notifications';
import adminRoutes from './api/admin/admin';
import pilotsRoutes from './api/pilots/pilots';
import settingsRoutes from './api/settings/settings';
import paymentRoutes from './api/payments/index';
import { logger } from './middleware/logger';
import { setupSwagger } from './docs/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://dronekrafthq-1.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pilots', pilotsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);

setupSwagger(app);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'DroneKraft Backend (Node.js)',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
