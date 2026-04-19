import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from './verifyJWT';

export const isPilot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || profile.role !== 'pilot') {
      return res.status(403).json({ error: 'Forbidden: Requires pilot privileges' });
    }

    next();
  } catch (error) {
    console.error('isPilot verification error:', error);
    res.status(500).json({ error: 'Internal Server Error during authorization' });
  }
};
