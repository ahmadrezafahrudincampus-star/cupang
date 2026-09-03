import { createPublicClient } from '@/lib/supabase/server'

export async function getFaqs() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('faqs')
      .select('*, category:faq_categories(*)')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function getFaqCategories() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('faq_categories')
      .select('*')
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
