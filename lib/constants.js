export const SITE_NAME = 'Aquatic Art'
export const SITE_DESCRIPTION = 'Premium Betta Fish Breeder and Aquatic Life Studio'
export const DEFAULT_CURRENCY = 'IDR'

export const FISH_STATUSES = {
  available: { label: 'Available', color: 'bg-green-500/10 text-green-500' },
  reserved: { label: 'Reserved', color: 'bg-yellow-500/10 text-yellow-500' },
  sold: { label: 'Sold', color: 'bg-red-500/10 text-red-500' }
}

export const INQUIRY_STATUSES = {
  pending: { label: 'Pending' },
  contacted: { label: 'Contacted' },
  resolved: { label: 'Resolved' },
  cancelled: { label: 'Cancelled' }
}

export const ITEMS_PER_PAGE = 12

export const WHATSAPP_BASE_URL = 'https://wa.me/'

export function generateWhatsAppUrl(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '')
  return `${WHATSAPP_BASE_URL}${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function formatPrice(price, currency = DEFAULT_CURRENCY) {
  if (price === null || price === undefined) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateFishInquiryMessage(fish) {
  return `Halo, saya tertarik dengan Betta ID ${fish.fish_code} - ${fish.name} ${fish.type || ''}. Apakah masih tersedia?`
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
