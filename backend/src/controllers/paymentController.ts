import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyJWT";
import { supabase } from "../config/supabase";

export const dummyPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
        return res.status(400).json({ error: "booking_id is required" });
    }

    // simulate delay (2 sec)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // update booking status
    // Note: In a real flow, you'd check if the status was 'pending' or 'approved' first.
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", booking_id)
      .select()
      .single();

    if (error || !data) {
      console.error("Payment update error:", error);
      return res.status(400).json({ error: "Payment failed - booking not found or update error" });
    }

    // send notification
    await supabase.from("notifications").insert({
      user_id: data.client_id,
      title: "Payment Successful 🎉",
      description: `Your payment for mission MIS-${data.id.substring(0,8).toUpperCase()} was successful. Your booking is now confirmed.`,
      type: "booking",
    });

    return res.json({
      success: true,
      message: "Dummy payment successful",
      booking: data,
    });
  } catch (err) {
    console.error("Dummy payment exception:", err);
    res.status(500).json({ error: "Dummy payment error" });
  }
};
