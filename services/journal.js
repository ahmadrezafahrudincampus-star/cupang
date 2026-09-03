import { createPublicClient } from '@/lib/supabase/server'

export async function getPublishedPosts({ page = 1, limit = 10, category } = {}) {
  try {
    const supabase = createPublicClient()
    let query = supabase
      .from('journal_posts')
      .select('*, category:journal_categories(*), author:profiles(*)', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      
    if (category) query = query.eq('category_id', category)
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) return { data: [], count: 0, error }
    return { data: data || [], count: count || 0, error: null }
  } catch (error) {
    return { data: [], count: 0, error }
  }
}

export async function getRecentPosts(limit = 3) {
  return getPublishedPosts({ page: 1, limit })
}

export async function getPostBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('journal_posts')
      .select('*, category:journal_categories(*), author:profiles(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
      
    if (error) return { data: null, error }
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getJournalCategories() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('journal_categories')
      .select('*')
      
    if (error) return { data: [], error }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}
