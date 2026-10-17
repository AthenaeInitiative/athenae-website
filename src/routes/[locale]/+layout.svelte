<script lang="ts">
	import { page } from '$app/state';
	import { resolveLocale } from '$lib/stores/locale';
	import { getSiteContent } from '$lib/content';

	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import Logo from '$lib/assets/athenae_logo.png';

	const content = $derived(getSiteContent(resolveLocale(page.params.locale)));

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content={content.site.description} />
	<meta property="og:site_name" content={content.site.title} />
	<meta property="og:image" content={Logo} />
</svelte:head>

<Nav />

<main id="main-content" tabindex="-1">
	{@render children()}
</main>

<Footer />
