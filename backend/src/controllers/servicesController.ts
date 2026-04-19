import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
