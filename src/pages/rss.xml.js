import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { RSS_CONFIG, formatDate } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	
	return rss({
		title: RSS_CONFIG.title,
		description: RSS_CONFIG.description,
		site: context.site || RSS_CONFIG.site,
		language: RSS_CONFIG.language,
		author: RSS_CONFIG.author,
		copyright: RSS_CONFIG.copyright,
		items: posts
			.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.date,
				link: `/blog/${post.slug}/`,
				content: post.body,
				...(post.data.image && { enclosure: { url: post.data.image, type: 'image/jpeg' } }),
			})),
	});
}
