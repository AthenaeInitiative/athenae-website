<script>
	import Hero from '$lib/components/Hero.svelte';
	import EventCard from '$lib/components/EventCard.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { getArticles, getUpcomingEvents } from '$lib/content';
	import { resolveLocale } from '$lib/stores/locale';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const locale = $derived(resolveLocale(page.params.locale));
	const upcomingEvents = $derived(getUpcomingEvents(locale).slice(0, 3));
	const latestArticles = $derived(getArticles(locale).slice(0, 3));
</script>

<section>
	<Hero />
</section>

<section class="section-container section-py">
	<div class="mb-10 flex items-end justify-between gap-6">
		<div>
			<p class="text-eyebrow mb-3">{locale === 'fr' ? 'À venir' : 'Coming up'}</p>
			<h2 class="text-section-heading">
				{locale === 'fr'
					? 'Des rencontres pour penser ensemble.'
					: 'Gatherings for thinking together.'}
			</h2>
		</div>
		<a class="nav-link hidden sm:block" href={resolve(`/${locale}/news`)}>
			{locale === 'fr' ? 'Voir toutes les nouvelles' : 'View all news'}
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
			{locale === 'fr'
				? 'De nouveaux événements seront annoncés bientôt.'
				: 'New events will be announced soon.'}
		</p>
	{/if}
</section>

<section class="border-t border-navy-700/30 bg-navy-900/40">
	<div class="section-container section-py">
		<div class="mb-10">
			<p class="text-eyebrow mb-3">{locale === 'fr' ? 'Carnets' : 'Field notes'}</p>
			<h2 class="text-section-heading">
				{locale === 'fr'
					? 'Les idées derrière nos rencontres.'
					: 'The ideas behind our gatherings.'}
			</h2>
		</div>
		{#if latestArticles.length > 0}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each latestArticles as article (article.slug)}
					<ArticleCard {article} />
				{/each}
			</div>
		{/if}
	</div>
</section>
