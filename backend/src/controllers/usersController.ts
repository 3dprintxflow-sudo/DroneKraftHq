import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/verifyJWT';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    if (error) {
      // If not found, return fallback based on auth metadata
      const fallback = {
        id: userId,
        full_name: req.user.user_metadata?.full_name || '',
        avatar_url: req.user.user_metadata?.avatar_url || '',
        role: 'customer',
        tier: 'Bronze',
        booking_count: 0,
        joined_date: new Date().toISOString()
      };
      return res.json(fallback);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { full_name, avatar_url } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, avatar_url })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      return res.status(400).json({ error: 'Failed to update profile' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
