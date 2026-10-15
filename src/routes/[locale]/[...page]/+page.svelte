<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		getArticle,
		getArticles,
		getEvent,
		getPageContent,
		getSiteContent,
		getUpcomingEvents
	} from '$lib/content';
	import { resolveLocale } from '$lib/stores/locale';
	import EventCard from '$lib/components/EventCard.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import MarkdownContent from '$lib/components/MarkdownContent.svelte';

	const locale = $derived(resolveLocale(page.params.locale));
	const slug = $derived(page.params.page ?? '');
	const content = $derived(getPageContent(locale, slug));
	const isNews = $derived(slug === 'news');
	const article = $derived(slug.startsWith('news/') ? getArticle(locale, slug.slice(5)) : null);
	const event = $derived(
		slug.startsWith('news/events/') ? getEvent(locale, slug.slice('news/events/'.length)) : null
	);
	const articles = $derived(getArticles(locale));
	const upcomingEvents = $derived(getUpcomingEvents(locale));
	const selectedTag = $derived(page.url.searchParams.get('tag'));
	const filteredArticles = $derived(
		selectedTag ? articles.filter((item) => item.tags.includes(selectedTag)) : articles
	);

	function linkHref(path: string) {
		return resolve(`/${locale}${path}`);
	}
</script>

<svelte:head>
	{#if article}
		<title>{article.title} — Athenae Initiative</title>
		<meta name="description" content={article.summary} />
	{:else if event}
		<title>{event.title} — Athenae Initiative</title>
		<meta name="description" content={event.summary} />
	{:else if content}
		<title>{content.title} — Athenae Initiative</title>
		<meta name="description" content={content.intro} />
	{:else}
		<title>Page not found — Athenae Initiative</title>
	{/if}
</svelte:head>

{#if article}
	<section class="section-container section-py pt-36">
		<div class="mx-auto max-w-3xl">
			<a class="nav-link" href={linkHref('/news')}
				>← {locale === 'fr' ? 'Toutes les nouvelles' : 'All news'}</a
			>
			<p class="text-eyebrow mt-10 mb-4">{article.publishedAt}</p>
			<h1 class="text-section-heading">{article.title}</h1>
			<p class="mt-6 text-lg leading-relaxed text-offwhite/75">{article.summary}</p>
			<div class="mt-6 flex flex-wrap gap-2">
				{#each article.tags as tag (tag)}
					<a class="tag" href={linkHref(`/news?tag=${encodeURIComponent(tag)}`)}>{tag}</a>
				{/each}
			</div>
			<img
				class="mt-10 aspect-[16/7] w-full object-cover"
				src={article.image}
				alt={article.imageAlt}
			/>
			<div class="mt-12">
				<MarkdownContent body={article.body} />
			</div>
		</div>
	</section>
{:else if event}
	<section class="section-container section-py pt-36">
		<div class="mx-auto max-w-4xl">
			<a class="nav-link" href={linkHref('/news')}
				>← {locale === 'fr' ? 'Toutes les nouvelles' : 'All news'}</a
			>
			<div class="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
				<img class="aspect-[4/3] w-full object-cover" src={event.image} alt={event.imageAlt} />
				<div>
					<p class="text-eyebrow mb-4">{event.date}</p>
					<h1 class="text-section-heading">{event.title}</h1>
					<p class="mt-6 leading-relaxed text-offwhite/75">{event.summary}</p>
					<p class="mt-6 text-sm text-bronze-300">{event.time} · {event.location}</p>
				</div>
			</div>
		</div>
	</section>
{:else if isNews}
	<section class="section-container section-py pt-36">
		<div class="mb-16 max-w-2xl">
			<p class="text-eyebrow mb-4">{content?.eyebrow}</p>
			<div class="divider-bronze-short mb-8"></div>
			<h1 class="text-section-heading">{content?.title}</h1>
			<p class="mt-6 text-lg leading-relaxed text-offwhite/75">{content?.intro}</p>
		</div>

		{#if upcomingEvents.length > 0}
			<div class="mb-20">
				<div class="mb-8 flex items-center justify-between">
					<h2 class="font-display text-3xl text-offwhite">
						{locale === 'fr' ? 'Événements à venir' : 'Upcoming events'}
					</h2>
				</div>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each upcomingEvents as upcomingEvent (upcomingEvent.slug)}
						<EventCard event={upcomingEvent} />
					{/each}
				</div>
			</div>
		{/if}

		<div>
			<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
				<h2 class="font-display text-3xl text-offwhite">
					{locale === 'fr' ? 'Articles' : 'Articles'}
				</h2>
				{#if selectedTag}
					<a class="tag" href={linkHref('/news')}>{selectedTag} ×</a>
				{/if}
			</div>
			{#if filteredArticles.length > 0}
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each filteredArticles as newsArticle (newsArticle.slug)}
						<ArticleCard article={newsArticle} />
					{/each}
				</div>
			{:else}
				<p class="text-offwhite/65">
					{locale === 'fr' ? 'Aucun article avec cette étiquette.' : 'No articles match this tag.'}
				</p>
			{/if}
		</div>
	</section>
{:else if content}
	<section class="section-container section-py pt-36">
		<div class="mx-auto max-w-3xl">
			<p class="text-eyebrow mb-4">{content.eyebrow}</p>
			<div class="divider-bronze-short mb-8"></div>
			<h1 class="text-section-heading mb-6">{content.title}</h1>
			<p class="max-w-2xl text-lg leading-relaxed text-offwhite/75">{content.intro}</p>

			<div class="mt-16">
				<MarkdownContent body={content.body} />
			</div>

			{#if slug === 'contact'}
				<a class="btn-bronze mt-12" href={`mailto:${getSiteContent(locale).site.email}`}>
					{locale === 'fr' ? 'Écrire un courriel' : 'Send an email'}
				</a>
			{:else if slug === 'donate'}
				<a class="btn-outline-bronze mt-12" href={linkHref('/contact')}>
					{locale === 'fr' ? 'Nous contacter' : 'Contact us'}
				</a>
			{/if}
		</div>
	</section>
{:else}
	<section class="section-container section-py pt-36">
		<p class="text-eyebrow mb-4">404</p>
		<h1 class="text-section-heading">Page not found</h1>
	</section>
{/if}
