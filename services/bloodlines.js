import { createClient } from '@/lib/supabase/server'

export async function getBloodlines() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bloodlines')
      .select('*')
      .eq('is_published', true)
      .order('name', { ascending: true })
      
    if (error) {
      console.error('Error fetching bloodlines:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (error) {
    console.error('Exception in getBloodlines:', error)
    return { data: null, error }
  }
}

export async function getBloodlineBySlug(slug) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bloodlines')
      .select('*')
      .eq('slug', slug)
      .single()
      
    if (error) {
      console.error('Error fetching bloodline by slug:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (error) {
    console.error('Exception in getBloodlineBySlug:', error)
    return { data: null, error }
  }
}
