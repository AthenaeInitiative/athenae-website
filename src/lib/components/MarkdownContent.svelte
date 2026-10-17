<script lang="ts">
	import { renderMarkdown } from '$lib/content';

	let { body }: { body: string } = $props();
	const html = $derived(renderMarkdown(body));
</script>

<div class="prose-athenae">
	{@html html}
</div>
