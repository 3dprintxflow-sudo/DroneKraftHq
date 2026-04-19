import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/verifyJWT';

// ─── Helper: send a notification ──────────────────────────────────────────
async function notify(userId: string, title: string, description: string, type = 'booking') {
  await supabase.from('notifications').insert({ user_id: userId, title, description, type });
}

// ─── CREATE booking (Customer) ────────────────────────────────────────────
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { service_id, mission_date, location, message } = req.body;
    const userId = req.user.id;

    const { data: serviceData, error: serviceError } = await supabase
      .from('services').select('*').eq('id', service_id).single();

    if (serviceError || !serviceData) {
      return res.status(400).json({ error: 'Invalid service_id' });
    }

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        client_id: userId,
        service_id,
        mission_date,
        location,
        message,
        status: 'pending',
        total_amount: serviceData.base_price || 0,
      })
      .select()
      .single();

    if (insertError || !booking) {
      return res.status(400).json({ error: 'Failed to create booking', details: insertError });
    }

    // Notify all admins
    const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
    for (const admin of admins || []) {
      await notify(admin.id, 'New Mission Request 🚁',
        `New ${serviceData.name} booking from a client — awaiting approval.`, 'system');
    }

    return res.status(201).json({
      id: booking.id,
      service: serviceData.name,
      date: booking.mission_date,
      status: booking.status,
      amount: booking.total_amount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── LIST bookings ────────────────────────────────────────────────────────
// Admin → all | Pilot → assigned to them | Customer → own
export const listBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', userId).single();

    const role = profile?.role;

    let query = supabase.from('bookings').select('*, services(name, icon_name)');

    if (role === 'admin') {
      // admins see everything
    } else if (role === 'pilot') {
      query = query.eq('pilot_id', userId);
    } else {
      query = query.eq('client_id', userId);
    }

    const { data: bookings, error } = await query.order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: 'Failed to fetch bookings' });

    const formatted = (bookings || []).map((b: any) => {
      const service = b.services;
      delete b.services;
      return { ...b, service_name: service?.name, service_icon: service?.icon_name };
    });

    return res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── ADMIN: approve/reject booking ───────────────────────────────────────
export const updateBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only admins can call this (route is already protected)
    const { data: booking, error } = await supabase
      .from('bookings').update({ status }).eq('id', id).select().single();

    if (error || !booking) return res.status(404).json({ error: 'Booking not found' });

    // Status-specific messages
    const statusMessages: Record<string, string> = {
      confirmed: 'Your mission has been APPROVED by Command! 🎉',
      cancelled:  'Your mission request has been cancelled.',
      active:     'Your mission is now ACTIVE — pilot is en route! 🚁',
      completed:  'Mission COMPLETE! Thank you for flying with DroneKraft.',
    };

    const message = statusMessages[status] || `Your mission status updated to: ${status}`;
    await notify(booking.client_id, `Mission ${status.toUpperCase()}`, message);

    // On completion → update loyalty
    if (status === 'completed') {
      const { data: profileData } = await supabase
        .from('profiles').select('booking_count').eq('id', booking.client_id).single();

      if (profileData) {
        const newCount = (profileData.booking_count || 0) + 1;
        const newTier = newCount >= 10 ? 'Gold' : newCount >= 3 ? 'Silver' : 'Bronze';
        await supabase.from('profiles').update({ booking_count: newCount, tier: newTier })
          .eq('id', booking.client_id);
      }
    }

    return res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── ADMIN: assign pilot to a booking ────────────────────────────────────
export const assignPilot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;           // booking id
    const { pilot_id } = req.body;

    // Verify the pilot exists and has the pilot role
    const { data: pilot } = await supabase
      .from('profiles').select('id, full_name, role').eq('id', pilot_id).single();

    if (!pilot || pilot.role !== 'pilot') {
      return res.status(400).json({ error: 'Invalid pilot_id — user must have pilot role' });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ pilot_id, status: 'confirmed' })
      .eq('id', id)
      .select('*, services(name)')
      .single();

    if (error || !booking) return res.status(404).json({ error: 'Booking not found' });

    const serviceName = (booking as any).services?.name || 'mission';

    // Notify pilot
    await notify(pilot_id, '🛩️ New Mission Assigned!',
      `You have been assigned to a ${serviceName} mission on ${booking.mission_date} at ${booking.location}.`
    );

    // Notify customer
    await notify(booking.client_id, '✅ Pilot Assigned',
      `A pilot has been assigned to your mission. Your mission is now confirmed!`
    );

    return res.json({ ...booking, pilot_name: pilot.full_name });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── PILOT: update own mission status ────────────────────────────────────
export const pilotUpdateMission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pilotId = req.user.id;

    const ALLOWED = ['active', 'completed'];
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ error: `Pilot can only set status to: ${ALLOWED.join(', ')}` });
    }

    // Verify this booking is assigned to this pilot
    const { data: existing } = await supabase
      .from('bookings').select('*').eq('id', id).eq('pilot_id', pilotId).single();

    if (!existing) return res.status(403).json({ error: 'Mission not assigned to you' });

    const { data: booking, error } = await supabase
      .from('bookings').update({ status }).eq('id', id).select().single();

    if (error || !booking) return res.status(400).json({ error: 'Update failed' });

    // Notify customer based on new status
    if (status === 'active') {
      await notify(booking.client_id, '🚁 Mission Active!',
        'Your drone pilot is en route and the mission has started!');
    } else if (status === 'completed') {
      await notify(booking.client_id, '✅ Mission Complete!',
        'Your mission has been completed successfully. Thank you for choosing DroneKraft!');

      // Update loyalty
      const { data: profileData } = await supabase
        .from('profiles').select('booking_count').eq('id', booking.client_id).single();
      if (profileData) {
        const newCount = (profileData.booking_count || 0) + 1;
        const newTier = newCount >= 10 ? 'Gold' : newCount >= 3 ? 'Silver' : 'Bronze';
        await supabase.from('profiles').update({ booking_count: newCount, tier: newTier })
          .eq('id', booking.client_id);
      }
    }

    return res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
