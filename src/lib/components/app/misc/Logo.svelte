<script module>
	let uid = 0;
</script>

<script>
	import logoMark from '$lib/assets/logo.svg?raw';
	let { class: className = '', style = '' } = $props();

	// Her örnek kendi gradyan kimliğini alır; gizli bir örnek diğerlerini bozmasın.
	const id = `mercan-grad-${++uid}`;
	const markup = logoMark.replaceAll('mercan-grad', id);
</script>

<div class={className} {style}>
	{@html markup}
</div>

<style>
	div :global(svg) {
		width: calc(var(--size, 1rem) * 0.91);
		height: var(--size, 1rem);
	}
</style>
