<script>
	import Hero from '$lib/components/Hero.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { getArticles, getSiteContent, getUpcomingEvents } from '$lib/content';
	import { resolveLocale } from '$lib/stores/locale';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const locale = $derived(resolveLocale(page.params.locale));
	const upcomingEvents = $derived(getUpcomingEvents(locale).slice(0, 3));
	const latestArticles = $derived(getArticles(locale).slice(0, 3));
	const content = $derived(getSiteContent(locale));
</script>

<section>
	<Hero />
</section>

<section class="section-container section-py">
	<div class="mb-10 flex items-end justify-between gap-6">
		<div>
			<p class="text-eyebrow mb-3">{content.home.upcomingLabel}</p>
			<h2 class="text-section-heading">
				{content.home.upcomingHeading}
			</h2>
		</div>
		<a class="nav-link hidden sm:block" href={resolve(`/${locale}/news`)}>
			{content.home.viewAllNews}
		</a>
	</div>

	{#if upcomingEvents.length > 0}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each upcomingEvents as event (event.slug)}
				<EventCard {event} />
			{/each}
		</div>
	{:else}
		<p class="text-offwhite/65">
			{content.news.noUpcomingEvents}
		</p>
	{/if}
</section>

<section class="border-t border-navy-700/30 bg-navy-900/40">
	<div class="section-container section-py">
		<div class="mb-10">
			<p class="text-eyebrow mb-3">{content.home.fieldNotesLabel}</p>
			<h2 class="text-section-heading">
				{content.home.fieldNotesHeading}
			</h2>
		</div>
		{#if latestArticles.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each latestArticles as article (article.slug)}
					<ArticleCard {article} />
				{/each}
			</div>
		{:else}
			<p class="text-offwhite/65">{content.news.noArticles}</p>
		{/if}
	</div>
</section>
