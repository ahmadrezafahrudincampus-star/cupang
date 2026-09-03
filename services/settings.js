import { createPublicClient } from '@/lib/supabase/server'

export async function getSiteSettings() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle()
      
    if (error) return { data: null, error }
    return { data: data || { brand_name: 'AQUATIC ART' }, error: null }
  } catch (error) {
    return { data: { brand_name: 'AQUATIC ART' }, error }
  }
}
