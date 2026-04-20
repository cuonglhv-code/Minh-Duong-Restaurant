import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query;

    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (catError) throw catError;

    // Fetch menu items
    let query = supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories (
          id, name_vi, name_en, slug, icon
        )
      `)
      .eq('is_available', true)
      .order('sort_order');

    if (category && category !== 'all') {
      const cat = categories?.find(c => c.slug === category);
      if (cat) query = query.eq('category_id', cat.id);
    }

    const { data: items, error: itemsError } = await query;
    if (itemsError) throw itemsError;

    return res.status(200).json({
      success: true,
      categories,
      items,
      total: items?.length || 0
    });

  } catch (error: any) {
    console.error('Menu API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Không thể tải thực đơn. Vui lòng thử lại.' 
    });
  }
}
