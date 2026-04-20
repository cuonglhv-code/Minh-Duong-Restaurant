import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buildBookingEmail } from '../src/emails/BookingEmail';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    customerName, customerPhone, branch,
    guestCount, bookingDate, bookingTime, specialRequests
  } = req.body;

  // Vietnamese validation error messages
  const errors: Record<string, string> = {};
  if (!customerName || customerName.trim().length < 2)
    errors.customerName = 'Vui lòng nhập họ và tên (ít nhất 2 ký tự)';
  
  if (!customerPhone || !/^(0|\+84)[0-9]{9}$/.test(customerPhone.trim()))
    errors.customerPhone = 'Số điện thoại không hợp lệ (VD: 0979292888)';
  
  if (!branch || !['hanoi', 'haiphong'].includes(branch))
    errors.branch = 'Vui lòng chọn chi nhánh';
  
  if (!guestCount || Number(guestCount) < 1 || Number(guestCount) > 50)
    errors.guestCount = 'Số lượng khách phải từ 1 đến 50';
  
  if (!bookingDate || new Date(bookingDate) < new Date(new Date().toDateString()))
    errors.bookingDate = 'Ngày đặt bàn không hợp lệ';
  
  if (!bookingTime || bookingTime < '10:00' || bookingTime > '22:00')
    errors.bookingTime = 'Giờ phục vụ từ 10:00 đến 22:00';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ errors });

  try {
    const branchLabel = branch === 'hanoi'
      ? 'Hà Nội – Số 2, Ngõ 295 Ngọc Thụy, Long Biên'
      : 'Hải Phòng – Số 271 Cầu Đen, Kiến Thụy';

    // Insert into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        branch,
        guest_count: Number(guestCount),
        booking_date: bookingDate,
        booking_time: bookingTime,
        special_requests: specialRequests?.trim() || '',
        status: 'pending'
      }])
      .select('id')
      .single();

    if (error) throw error;

    // Send owner notification email — non-fatal if it fails
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.OWNER_EMAIL!,
        subject: `🐦 Đặt Bàn Mới – ${customerName.trim()} – ${bookingDate} ${bookingTime} – ${branchLabel}`,
        html: buildBookingEmail({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          branch: branchLabel,
          guestCount: Number(guestCount),
          bookingDate,
          bookingTime,
          specialRequests: specialRequests?.trim() || 'Không có',
          bookingId: data.id,
          createdAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
        })
      });

      await supabase
        .from('bookings')
        .update({ notified_at: new Date().toISOString() })
        .eq('id', data.id);
    } catch (emailErr) {
      console.error('Email notification failed (non-fatal):', emailErr);
    }

    return res.status(200).json({ success: true, bookingId: data.id });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Đã có lỗi xảy ra, vui lòng thử lại hoặc gọi 0979.292.888' });
  }
}
