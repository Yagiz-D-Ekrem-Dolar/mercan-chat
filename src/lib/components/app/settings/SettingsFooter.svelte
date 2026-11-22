<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		onReset?: () => void;
		onSave?: () => void;
	}

	// Ayarlarda yalnızca tema kaldığı için sıfırlama düğmesi yok.
	let { onSave }: Props = $props();
</script>

<div
	class="mercan-settings-footer sticky bottom-0 mx-auto mt-4 flex w-full justify-end pb-4 md:pb-0"
>
	<Button class="rounded-full px-6" onclick={() => onSave?.()}>Kaydet</Button>
</div>
