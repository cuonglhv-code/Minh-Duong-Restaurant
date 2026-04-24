import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    customerName, customerPhone, orderMode, branch,
    guestCount, deliveryAddress, orderDate, orderTime,
    orderItems, totalAmount, notes
  } = req.body;

  const errors: Record<string, string> = {};

  if (!customerName || customerName.trim().length < 2)
    errors.customerName = 'Vui lòng nhập họ và tên (ít nhất 2 ký tự)';

  if (!customerPhone || !/^(0|\+84)[0-9]{9}$/.test(customerPhone.trim()))
    errors.customerPhone = 'Số điện thoại không hợp lệ (VD: 0979292888)';

  if (!orderMode || !['dinein', 'takeaway', 'delivery'].includes(orderMode))
    errors.orderMode = 'Vui lòng chọn hình thức đặt món';

  if (orderMode === 'dinein' || orderMode === 'takeaway') {
    if (!branch || !['hanoi', 'haiphong'].includes(branch))
      errors.branch = 'Vui lòng chọn chi nhánh';

    if (!guestCount || Number(guestCount) < 1 || Number(guestCount) > 50)
      errors.guestCount = 'Số lượng khách phải từ 1 đến 50';

    if (!orderDate)
      errors.orderDate = 'Vui lòng chọn ngày';

    if (!orderTime || orderTime < '10:00' || orderTime > '22:00')
      errors.orderTime = 'Giờ phục vụ từ 10:00 đến 22:00';
  }

  if (orderMode === 'delivery') {
    if (!deliveryAddress || deliveryAddress.trim().length < 10)
      errors.deliveryAddress = 'Vui lòng nhập địa chỉ giao hàng đầy đủ';
  }

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0)
    errors.orderItems = 'Giỏ hàng trống';

  if (!totalAmount || Number(totalAmount) <= 0)
    errors.totalAmount = 'Giá trị đơn hàng không hợp lệ';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ errors });

  try {
    let branchLabel = '';
    if (orderMode === 'dinein' || orderMode === 'takeaway') {
      branchLabel = branch === 'hanoi'
        ? 'Hà Nội – Số 2, Ngõ 295 Ngọc Thụy, Long Biên'
        : 'Hải Phòng – Số 271 Cầu Đen, Kiến Thụy';
    }

    const modeLabel = {
      'dinein': 'Tại quán',
      'takeaway': 'Mang đi',
      'delivery': 'Giao hàng tận nơi'
    }[orderMode] || orderMode;

    const orderItemsSummary = orderItems
      .map((item: any) => `${item.name} x${item.qty}`)
      .join(', ');

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        order_mode: orderMode,
        branch: branch || null,
        guest_count: guestCount ? Number(guestCount) : null,
        delivery_address: deliveryAddress?.trim() || null,
        order_date: orderDate || null,
        order_time: orderTime || null,
        order_items: orderItems,
        total_amount: Number(totalAmount),
        notes: notes?.trim() || '',
        status: 'pending'
      }])
      .select('id')
      .single();

    if (error) throw error;

    // Send owner notification email
    try {
      if (process.env.OWNER_EMAIL && process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: process.env.OWNER_EMAIL,
          subject: `🍽 Đơn Hàng Mới – ${customerName.trim()} – ${modeLabel} – ${Number(totalAmount).toLocaleString('vi-VN')}đ`,
          html: `
            <h2>Đơn Hàng Mới</h2>
            <p><strong>Khách hàng:</strong> ${customerName}</p>
            <p><strong>Điện thoại:</strong> ${customerPhone}</p>
            <p><strong>Hình thức:</strong> ${modeLabel}</p>
            ${branchLabel ? `<p><strong>Chi nhánh:</strong> ${branchLabel}</p>` : ''}
            ${orderDate ? `<p><strong>Ngày:</strong> ${orderDate}</p>` : ''}
            ${orderTime ? `<p><strong>Giờ:</strong> ${orderTime}</p>` : ''}
            ${deliveryAddress ? `<p><strong>Địa chỉ giao:</strong> ${deliveryAddress}</p>` : ''}
            <p><strong>Món:</strong> ${orderItemsSummary}</p>
            <p><strong>Tổng tiền:</strong> ${Number(totalAmount).toLocaleString('vi-VN')}đ</p>
            ${notes ? `<p><strong>Ghi chú:</strong> ${notes}</p>` : ''}
            <p><em>ID: ${data.id}</em></p>
          `
        });

        await supabase
          .from('orders')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', data.id);
      }
    } catch (emailErr) {
      console.error('Email notification failed (non-fatal):', emailErr);
    }

    return res.status(200).json({ success: true, orderId: data.id });
  } catch (err) {
    console.error('Order error:', err);
    return res.status(500).json({ error: 'Đã có lỗi xảy ra, vui lòng thử lại hoặc gọi 0979.292.888' });
  }
}