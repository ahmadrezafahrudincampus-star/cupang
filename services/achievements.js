import { createPublicClient } from '@/lib/supabase/server'

export async function getPublishedAchievements() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('published', true)
      .order('year', { ascending: false })
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
