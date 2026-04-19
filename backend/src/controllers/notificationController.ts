import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/verifyJWT';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) return res.status(400).json({ error: 'Failed to fetch notifications' });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_unread: false })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
      
    if (error) return res.status(404).json({ error: 'Notification not found' });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_unread: false })
      .eq('user_id', req.user.id)
      .eq('is_unread', true);
      
    if (error) return res.status(400).json({ error: 'Update failed' });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
