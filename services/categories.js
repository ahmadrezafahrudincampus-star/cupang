import { createPublicClient } from '@/lib/supabase/server'

export async function getCategories() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    
    if (error) return { data: null, error }
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
