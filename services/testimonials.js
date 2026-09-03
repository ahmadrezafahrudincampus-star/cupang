import { createPublicClient } from '@/lib/supabase/server'

export async function getPublishedTestimonials(limit = 6) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit)
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
