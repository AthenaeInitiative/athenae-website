<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { resolveLocale } from '$lib/stores/locale';
	import { getSiteContent, type Event } from '$lib/content';

	let { event }: { event: Event } = $props();
	const currentLocale = $derived(resolveLocale(page.params.locale));

	const formattedDate = $derived(
		new Intl.DateTimeFormat(currentLocale, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(`${event.date}T12:00:00`))
	);

	function linkHref(path: string) {
		return resolve(`/${currentLocale}${path}`);
	}
</script>

<article class="card-navy group overflow-hidden">
	<div class="aspect-[16/9] overflow-hidden bg-navy-700">
		<img
			src={event.image}
			alt={event.imageAlt}
			class="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
		/>
	</div>
	<div class="p-6">
		<p class="text-eyebrow mb-3">{formattedDate}</p>
		<h3 class="font-display text-2xl text-offwhite">{event.title}</h3>
		<p class="mt-3 text-sm leading-relaxed text-offwhite/65">{event.summary}</p>
		<div class="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-wide text-bronze-300">
			<span>{event.time}</span>
			<span>{event.location}</span>
		</div>
		<a
			href={linkHref(`/news/events/${event.slug}`)}
			class="btn-outline-bronze mt-6 px-4 py-2 text-xs"
		>
			{getSiteContent(currentLocale).actions.eventDetails}
		</a>
	</div>
</article>
