import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/verifyJWT';

export const listPilots = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: pilots, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'pilot');
      
    if (error) {
      return res.status(400).json({ error: 'Failed to fetch pilots' });
    }
    
    const formattedPilots = (pilots || []).map((p: any, i: number) => ({
      id: p.id,
      name: p.full_name || p.email?.split('@')[0] || `Pilot ${i+1}`,
      avatar: p.avatar_url || 'U',
      status: i % 2 === 0 ? 'On Mission' : 'Available',
      tier: p.tier || 'DGCA L2',
      missions: p.booking_count || Math.floor(Math.random() * 200),
      rating: parseFloat((4.5 + (Math.random() * 0.5)).toFixed(1)),
      active_mission: i % 2 === 0 ? `MIS-00${i+2}` : null
    }));
    
    return res.json(formattedPilots);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
