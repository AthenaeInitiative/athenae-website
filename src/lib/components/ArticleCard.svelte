<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { resolveLocale } from '$lib/stores/locale';
	import type { Article } from '$lib/content';

	let { article }: { article: Article } = $props();
	const currentLocale = $derived(resolveLocale(page.params.locale));

	const formattedDate = $derived(
		new Intl.DateTimeFormat(currentLocale, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(`${article.publishedAt}T12:00:00`))
	);

	function linkHref(path: string) {
		return resolve(`/${currentLocale}${path}`);
	}
</script>

<article class="card-navy group overflow-hidden">
	<div class="aspect-[16/9] overflow-hidden bg-navy-700">
		<img
			src={article.image}
			alt={article.imageAlt}
			class="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
		/>
	</div>
	<div class="p-6">
		<p class="text-eyebrow mb-3">{formattedDate}</p>
		<h3 class="font-display text-2xl text-offwhite">{article.title}</h3>
		<p class="mt-3 text-sm leading-relaxed text-offwhite/65">{article.summary}</p>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each article.tags as tag (tag)}
				<a class="tag" href={linkHref(`/news?tag=${encodeURIComponent(tag)}`)}>{tag}</a>
			{/each}
		</div>
		<a href={linkHref(`/news/${article.slug}`)} class="btn-outline-bronze mt-6 px-4 py-2 text-xs">
			{currentLocale === 'fr' ? 'Lire l’article' : 'Read article'}
		</a>
	</div>
</article>
