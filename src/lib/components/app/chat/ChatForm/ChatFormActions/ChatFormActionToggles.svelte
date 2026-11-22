<script lang="ts">
	import { Globe, Lightbulb } from '@lucide/svelte';
	import { ReasoningEffort } from '$lib/enums';
	import { useReasoningMenu } from '$lib/hooks/use-reasoning-menu.svelte';
	import { chatStore, conversationsStore, webSearchStore } from '$lib/stores';

	interface Props {
		disabled?: boolean;
	}

	let { disabled = false }: Props = $props();

	const reasoning = useReasoningMenu();

	const thinkingOn = $derived(reasoning.isReasoningActive);
	const thinkingNow = $derived(chatStore.isReasoning);

	function toggleReasoning() {
		conversationsStore.preferences.setReasoningEffort(
			thinkingOn ? ReasoningEffort.OFF : ReasoningEffort.MEDIUM
		);
	}
</script>

<div class="flex items-center gap-1.5">
	<button
		aria-pressed={webSearchStore.enabled}
		class="mercan-toggle"
		data-active={webSearchStore.enabled}
		data-kind="web"
		{disabled}
		onclick={() => webSearchStore.toggle()}
		title={webSearchStore.enabled ? 'Web arama açık' : 'Web arama kapalı'}
		type="button"
	>
		<Globe class="h-3.5 w-3.5" />

		<span class="mercan-toggle__label">Web arama</span>
	</button>

	<button
		aria-pressed={thinkingOn}
		class="mercan-toggle"
		data-active={thinkingOn}
		data-kind="think"
		data-pulse={thinkingNow}
		{disabled}
		onclick={toggleReasoning}
		title={thinkingOn ? 'Düşünme açık' : 'Düşünme kapalı'}
		type="button"
	>
		<Lightbulb class="h-3.5 w-3.5" />

		<span class="mercan-toggle__label">Düşünme</span>
	</button>
</div>
