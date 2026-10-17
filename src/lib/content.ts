import siteContent from '../../content/site.json';
import eventsContent from '../../content/events.json';
import articlesContent from '../../content/articles.json';
import aboutPageEn from '../../content/pages/about.en.json';
import aboutPageFr from '../../content/pages/about.fr.json';
import programsPageEn from '../../content/pages/programs.en.json';
import programsPageFr from '../../content/pages/programs.fr.json';
import getInvolvedPageEn from '../../content/pages/get-involved.en.json';
import getInvolvedPageFr from '../../content/pages/get-involved.fr.json';
import newsPageEn from '../../content/pages/news.en.json';
import newsPageFr from '../../content/pages/news.fr.json';
import contactPageEn from '../../content/pages/contact.en.json';
import contactPageFr from '../../content/pages/contact.fr.json';
import donatePageEn from '../../content/pages/donate.en.json';
import donatePageFr from '../../content/pages/donate.fr.json';
import termsPageEn from '../../content/pages/terms.en.json';
import termsPageFr from '../../content/pages/terms.fr.json';
import privacyPageEn from '../../content/pages/privacy.en.json';
import privacyPageFr from '../../content/pages/privacy.fr.json';
import { marked } from 'marked';
import type { Locale } from './stores/locale';

type ContentPageData = typeof aboutPageEn;

export type SiteContent = (typeof siteContent)['en'] & {
	pages: {
		about: ContentPageData;
		programs: typeof programsPageEn;
		'get-involved': typeof getInvolvedPageEn;
		news: typeof newsPageEn;
		contact: typeof contactPageEn;
		donate: typeof donatePageEn;
		legal: {
			terms: typeof termsPageEn;
			privacy: typeof privacyPageEn;
		};
	};
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
	return {
		...site,
		pages: {
			about: locale === 'fr' ? aboutPageFr : aboutPageEn,
			programs: locale === 'fr' ? programsPageFr : programsPageEn,
			'get-involved': locale === 'fr' ? getInvolvedPageFr : getInvolvedPageEn,
			news: locale === 'fr' ? newsPageFr : newsPageEn,
			contact: locale === 'fr' ? contactPageFr : contactPageEn,
			donate: locale === 'fr' ? donatePageFr : donatePageEn,
			legal: {
				terms: locale === 'fr' ? termsPageFr : termsPageEn,
				privacy: locale === 'fr' ? privacyPageFr : privacyPageEn
			}
		},
		...events,
		...articles
	};
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
