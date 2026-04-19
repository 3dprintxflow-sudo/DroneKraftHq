import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/verifyJWT';

export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 1. Get all bookings for total revenue
    const { data: allBookings } = await supabase.from('bookings').select('total_amount, status, created_at');
    
    // 2. Get total customers
    const { count: customerCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    // 3. Filter for current month stats
    const monthBookings = allBookings?.filter(b => b.created_at >= firstDayOfMonth) || [];
    const monthRevenue = monthBookings.reduce((acc, b) => acc + (Number(b.total_amount) || 0), 0);
    
    const totalRevenue = (allBookings || []).reduce((acc: number, b: any) => acc + (Number(b.total_amount) || 0), 0);
    const activeMissions = allBookings?.filter(b => b.status === 'active').length || 0;
    
    return res.json({
      revenue: totalRevenue,
      month_revenue: monthRevenue,
      bookings: allBookings?.length || 0,
      month_bookings: monthBookings.length,
      active_pilots: activeMissions,
      total_customers: customerCount || 0,
      revenue_growth: "+15%", // Placeholder growth
      bookings_growth: `+${monthBookings.length}`,
      customers_growth: "+5 this week"
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRevenueAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('total_amount, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueMap: Record<string, number> = {};
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      revenueMap[days[d.getDay()]!] = 0;
    }

    let total7Days = 0;
    (bookings || []).forEach(b => {
      const day = days[new Date(b.created_at).getDay()]!;
      const amount = Number(b.total_amount) || 0;
      if (revenueMap[day] !== undefined) {
        revenueMap[day] += amount;
        total7Days += amount;
      }
    });

    const sortedChartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const day = days[d.getDay()]!;
        sortedChartData.push({
            day,
            revenue: revenueMap[day] || 0
        });
    }

    return res.json({
      total_7_days: total7Days,
      chart_data: sortedChartData
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPilots = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('role', 'pilot');

    if (error) throw error;

    return res.json(data.map(p => ({
      id: p.id,
      name: p.full_name || 'Unknown Pilot',
      status: 'available'
    })));
  } catch (error) {
    console.error('Error fetching pilots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPilot = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    });

    if (authError) throw authError;

    // 2. Update the profile role to 'pilot'
    // The profile is usually created via trigger, but let's ensure it's set to pilot
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'pilot', full_name })
      .eq('id', authData.user.id);

    if (profileError) throw profileError;

    return res.status(201).json({ 
      message: 'Pilot account created successfully',
      pilot: { id: authData.user.id, email, full_name }
    });
  } catch (error: any) {
    console.error('Error creating pilot:', error);
    res.status(500).json({ error: error.message || 'Failed to create pilot account' });
  }
};

export const assignPilot = async (req: AuthenticatedRequest, res: Response) => {
  const { booking_id, pilot_id } = req.body;

  if (!booking_id || !pilot_id) {
    return res.status(400).json({ error: 'Booking ID and Pilot ID are required' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        pilot_id,
        status: 'confirmed', // Automatically confirm when assigned
        updated_at: new Date().toISOString()
      })
      .eq('id', booking_id)
      .select();

    if (error) throw error;

    // 3. Optional: Create notification for the pilot (if system exists)
    await supabase.from('notifications').insert({
      user_id: pilot_id,
      title: 'New Mission Assigned',
      description: `You have been assigned to a new mission (ID: ${booking_id.substring(0,8)}).`,
      type: 'booking'
    });

    return res.json({ message: 'Pilot assigned and mission confirmed', booking: data[0] });
  } catch (error) {
    console.error('Error assigning pilot:', error);
    res.status(500).json({ error: 'Failed to assign pilot' });
  }
};
