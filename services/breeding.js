import { createPublicClient } from '@/lib/supabase/server'

export async function getBreedingStages() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('breeding_stages')
      .select('*')
      .eq('published', true)
      .order('stage_number', { ascending: true, nullsFirst: false })
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
