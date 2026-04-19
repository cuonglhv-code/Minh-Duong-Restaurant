import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, phone, email, branch } = req.body;

  const errors: Record<string, string> = {};
  if (!fullName || fullName.trim().length < 2)
    errors.fullName = 'Vui lòng nhập họ và tên (ít nhất 2 ký tự)';

  if (!phone || !/^(0|\+84)[0-9]{9}$/.test(phone.trim()))
    errors.phone = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng: 0979292888';

  if (!branch || !['hanoi', 'haiphong'].includes(branch))
    errors.branch = 'Vui lòng chọn chi nhánh';

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ errors });

  try {
    const existingMember = await supabase
      .from('loyalty_members')
      .select('id, stamp_count, total_visits')
      .eq('phone', phone.trim())
      .single();

    if (existingMember.data) {
      return res.status(409).json({
        error: 'Số điện thoại này đã đăng ký. Gọi 0979.292.888 để kiểm tra điểm tích luỹ.'
      });
    }

    const { data, error: insertError } = await supabase
      .from('loyalty_members')
      .insert([{
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        branch: branch,
        stamp_count: 1,
        status: 'active'
      }])
      .select('id')
      .single();

    if (insertError) throw insertError;

    return res.status(200).json({ success: true, memberId: data.id, initialStamps: 1 });
  } catch (err) {
    console.error('Loyalty registration error:', err);
    return res.status(500).json({ error: 'Đã có lỗi xảy ra, vui lòng thử lại hoặc gọi 0979.292.888' });
  }
}