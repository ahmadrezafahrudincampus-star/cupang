import { createPublicClient } from '@/lib/supabase/server'

export async function getFeaturedFish(limit = 6) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('fish')
      .select('*, category:categories(*), media:fish_media(*)')
      .eq('published', true)
      .eq('featured', true)
      .limit(limit)
    
    if (error) {
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function getAvailableFish({ category, type, gender, grade, bloodline, status = 'available', search, page = 1, limit = 12 } = {}) {
  try {
    const supabase = createPublicClient()
    let query = supabase
      .from('fish')
      .select('*, category:categories(*), media:fish_media(*)', { count: 'exact' })
      .eq('published', true)
    
    if (status) query = query.eq('status', status)
    if (category) query = query.eq('category_id', category)
    if (type) query = query.eq('type', type)
    if (gender) query = query.eq('gender', gender)
    if (grade) query = query.eq('grade', grade)
    if (bloodline) query = query.eq('bloodline_id', bloodline)
    if (search) query = query.or(`name.ilike.%${search}%,fish_code.ilike.%${search}%`)

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, count, error } = await query
    
    if (error) {
      return { data: [], count: 0, error }
    }
    return { data: data || [], count: count || 0, error: null }
  } catch (error) {
    return { data: [], count: 0, error }
  }
}

export async function getFishBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('fish')
      .select('*, category:categories(*), bloodline:bloodlines(*), media:fish_media(*)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    
    if (error) {
      return { data: null, error }
    }
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getFishByCategory(categorySlug, page = 1, limit = 12) {
  try {
    const supabase = createPublicClient()
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()

    if (!category) return { data: [], count: 0, error: 'Category not found' }

    return getAvailableFish({ category: category.id, page, limit })
  } catch (error) {
    return { data: [], count: 0, error }
  }
}

export async function getRelatedFish(fishId, categoryId, limit = 3) {
  try {
    const supabase = createPublicClient()
    let query = supabase
      .from('fish')
      .select('*, category:categories(*), media:fish_media(*)')
      .eq('published', true)
      .neq('id', fishId)
      .limit(limit)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query
    if (error) {
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export { getCategoryBySlug, getCategories } from '@/services/categories'
