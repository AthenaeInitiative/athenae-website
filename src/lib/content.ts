import siteContent from '../../content/site.json';
import eventsContent from '../../content/events.json';
import articlesContent from '../../content/articles.json';
import { marked } from 'marked';
import type { Locale } from './stores/locale';

export type SiteContent = Omit<(typeof siteContent)['en'], 'events' | 'articles'> & {
	events: (typeof eventsContent)['en']['events'];
	articles: (typeof articlesContent)['en']['articles'];
};
export type ContentPage = SiteContent['pages'][Exclude<keyof SiteContent['pages'], 'legal'>];
export type Event = SiteContent['events'][number];
export type Article = SiteContent['articles'][number];

export function getSiteContent(locale: Locale): SiteContent {
	const site = siteContent[locale] ?? siteContent.en;
	const events = eventsContent[locale] ?? eventsContent.en;
	const articles = articlesContent[locale] ?? articlesContent.en;
	return { ...site, ...events, ...articles };
}

export function getPageContent(locale: Locale, slug: string): ContentPage | null {
	const pages = getSiteContent(locale).pages;
	const content =
		slug.startsWith('legal/') && slug.slice('legal/'.length) in pages.legal
			? pages.legal[slug.slice('legal/'.length) as keyof typeof pages.legal]
			: pages[slug as keyof Omit<SiteContent['pages'], 'legal'>];
	return content ?? null;
}

export function getUpcomingEvents(locale: Locale): Event[] {
	const today = new Date().toISOString().slice(0, 10);
	return [...getSiteContent(locale).events]
		.filter((event) => event.date >= today)
		.sort((a, b) => a.date.localeCompare(b.date));
}

export function getArticles(locale: Locale): Article[] {
	return [...getSiteContent(locale).articles].sort((a, b) =>
		b.publishedAt.localeCompare(a.publishedAt)
	);
}

export function getArticle(locale: Locale, slug: string): Article | null {
	return getSiteContent(locale).articles.find((article) => article.slug === slug) ?? null;
}

export function getEvent(locale: Locale, slug: string): Event | null {
	return getSiteContent(locale).events.find((event) => event.slug === slug) ?? null;
}

export function renderMarkdown(value: string): string {
	return marked.parse(value.replace(/<[^>]*>/g, ''), { gfm: true }) as string;
}
