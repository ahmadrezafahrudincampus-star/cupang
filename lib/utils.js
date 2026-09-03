export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date, locale = 'id-ID') {
  if (!date) return ''
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncate(str, length) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '')
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone) {
  // Indonesian phone format validation (simple)
  return /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/g.test(phone)
}
