<script lang="ts">
	import { serverStore } from '$lib/stores';
	import Logo from '$lib/components/app/misc/Logo.svelte';

	interface Props {
		isEmpty: boolean;
	}

	let { isEmpty = false }: Props = $props();
</script>

<div
	class={[
		'pointer-events-none mb-4 hidden px-4 text-center text-balance',
		isEmpty && 'mb-[calc(50dvh-8rem)] md:mb-8 pointer-events-auto block!'
	]}
>
	<div class="mb-6 flex w-full justify-center">
		<!-- Üzerine gelince sağdan "Mercan" yazısı açılır -->
		<div class="mercan-hero">
			<Logo class="mercan-hero-mark" style="--size: 4.75rem" />

			<span class="mercan-hero__wrap" aria-hidden="true">
				<span class="mercan-hero__word">Mercan</span>
			</span>
		</div>
	</div>

	<p class="text-muted-foreground md:text-lg">
		{serverStore.props?.modalities?.audio ? 'Ses kaydet ya da mesaj yaz' : 'Bir mesaj yaz'} ve başla
	</p>
</div>
