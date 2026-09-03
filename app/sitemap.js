import { getAvailableFish } from '@/services/fish';
import { getPublishedPosts } from '@/services/journal';
import { getCategories } from '@/services/categories';
import { locales } from '@/lib/i18n/config';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [fishRes, postsRes, catRes] = await Promise.all([
    getAvailableFish({ limit: 100 }),
    getPublishedPosts({ limit: 100 }),
    getCategories()
  ]);

  const fishList = fishRes?.data || [];
  const posts = postsRes?.data || [];
  const categories = catRes?.data || [];

  const staticPaths = [
    '',
    '/about',
    '/collection',
    '/breeding',
    '/farm',
    '/gallery',
    '/achievements',
    '/testimonials',
    '/journal',
    '/faq',
    '/contact',
    '/inquire',
    '/privacy',
    '/terms',
    '/shipping-policy',
    '/guarantee',
  ];

  const localizedStatic = [];
  locales.forEach((loc) => {
    staticPaths.forEach((route) => {
      localizedStatic.push({
        url: `${baseUrl}/${loc}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  const localizedFish = [];
  locales.forEach((loc) => {
    fishList.forEach((fish) => {
      localizedFish.push({
        url: `${baseUrl}/${loc}/fish/${fish.slug}`,
        lastModified: new Date(fish.updated_at || fish.created_at || Date.now()),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    });
  });

  const localizedCategories = [];
  locales.forEach((loc) => {
    categories.forEach((cat) => {
      localizedCategories.push({
        url: `${baseUrl}/${loc}/collection/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  const localizedPosts = [];
  locales.forEach((loc) => {
    posts.forEach((post) => {
      localizedPosts.push({
        url: `${baseUrl}/${loc}/journal/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return [...localizedStatic, ...localizedCategories, ...localizedFish, ...localizedPosts];
}
