import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function submitInquiry(inquiryData) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single()
      
    if (error) {
      console.error('Error submitting inquiry:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (error) {
    console.error('Exception in submitInquiry:', error)
    return { data: null, error }
  }
}

export async function getInquiries(status = null, page = 1, limit = 20) {
  try {
    const supabase = createAdminClient()
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    let query = supabase
      .from('inquiries')
      .select('*, fish:fish(name, fish_code)', { count: 'exact' })
      
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, count, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching inquiries:', error)
      return { data: null, count: 0, error }
    }
    return { data, count, error: null }
  } catch (error) {
    console.error('Exception in getInquiries:', error)
    return { data: null, count: 0, error }
  }
}

export async function updateInquiryStatus(id, status) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
      
    if (error) {
      console.error('Error updating inquiry status:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (error) {
    console.error('Exception in updateInquiryStatus:', error)
    return { data: null, error }
  }
}
