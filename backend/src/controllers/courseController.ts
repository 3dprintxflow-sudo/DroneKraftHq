import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const listCourses = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('courses').select('*').eq('is_published', true);
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
