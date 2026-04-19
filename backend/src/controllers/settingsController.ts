import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/verifyJWT';

let systemSettings = {
  auto_approve_bookings: false,
  email_notifications: true,
  sms_alerts: true,
  show_revenue_subadmin: false,
  enable_loyalty: true
};

export const getSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json(systemSettings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    systemSettings = { ...systemSettings, ...req.body };
    return res.json({ message: 'Settings updated successfully', settings: systemSettings });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
