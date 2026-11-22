<script lang="ts">
	import { Music } from '@lucide/svelte';

	interface Props {
		currentItem: { name?: string } | null;
		audioSrc: string | null;
	}

	let { audioSrc, currentItem }: Props = $props();
</script>

<div class="flex flex-1 items-center justify-center p-8">
	<div class="w-full max-w-md text-center">
		<Music class="mx-auto mb-4 h-16 w-16 text-white/50" />

		{#if audioSrc}
			<audio class="mb-4 w-full" controls src={audioSrc}>
				Tarayıcın ses öğesini desteklemiyor.
			</audio>
		{:else}
			<p class="mb-4 text-white/70">Ses önizlemesi yok</p>
		{/if}

		<p class="text-sm text-white/50">{currentItem?.name || 'Audio'}</p>
	</div>
</div>
