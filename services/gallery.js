import { createPublicClient } from '@/lib/supabase/server'

export async function getGalleryItems(categorySlug) {
  try {
    const supabase = createPublicClient()
    let query = supabase
      .from('gallery_items')
      .select('*, category:gallery_categories(*)')
      .eq('published', true)
      .order('sort_order', { ascending: true })

    if (categorySlug) {
      const { data: cat } = await supabase
        .from('gallery_categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle()
      if (cat) query = query.eq('category_id', cat.id)
    }

    const { data, error } = await query
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function getGalleryCategories() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
