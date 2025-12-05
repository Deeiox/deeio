import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

type SearchItem = {
  id: string;
  collection: 'blog' | 'collection';
  title: string;
  url: string;
};

export const GET: APIRoute = async ({ url }) => {
  const query = (url.searchParams.get('q') || '').trim().toLowerCase();

  const [blog, collection] = await Promise.all([
    getCollection('blog'),
    getCollection('collection'),
  ]);

  const allItems: SearchItem[] = [
    ...blog.map((p) => ({
      id: p.id,
      collection: 'blog' as const,
      title: p.data.title,
      url: `/blog/${p.id}`,
    })),
    ...collection.map((p) => ({
      id: p.id,
      collection: 'collection' as const,
      title: p.data.title,
      url: `/collection/${p.id}`,
    })),
  ];

  const results = query
    ? allItems.filter((item) => item.title.toLowerCase().includes(query))
    : [];

  return new Response(JSON.stringify({ query, count: results.length, results }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};


