import { createPublicClient } from '@/lib/supabase/server'

export async function getFarmSections() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('farm_sections')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
