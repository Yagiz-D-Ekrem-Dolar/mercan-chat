<script lang="ts">
	import { FileX } from '@lucide/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	interface Props {
		open: boolean;
		emptyFiles: string[];
		onOpenChange?: (open: boolean) => void;
	}

	let { emptyFiles, onOpenChange, open = $bindable() }: Props = $props();

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		onOpenChange?.(newOpen);
	}
</script>

<AlertDialog.Root onOpenChange={handleOpenChange} {open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2">
				<FileX class="h-5 w-5 text-destructive" />

				Boş dosyalar bulundu
			</AlertDialog.Title>

			<AlertDialog.Description>
				Şu dosyalar boş olduğu için eklerinden kaldırıldı:
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="space-y-3 text-sm">
			<div class="rounded-lg bg-muted p-3">
				<div class="mb-2 font-medium">Boş dosyalar:</div>

				<ul class="list-inside list-disc space-y-1 text-muted-foreground">
					{#each emptyFiles as fileName (fileName)}
						<li class="font-mono text-sm">{fileName}</li>
					{/each}
				</ul>
			</div>

			<div>
				<div class="mb-2 font-medium">Ne oldu:</div>

				<ul class="list-inside list-disc space-y-1 text-muted-foreground">
					<li>Boş dosyalar işlenemez ya da modele gönderilemez</li>

					<li>Bu dosyalar eklerinden otomatik olarak kaldırıldı</li>

					<li>Bunun yerine içeriği olan dosyalar yüklemeyi deneyebilirsin</li>
				</ul>
			</div>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => handleOpenChange(false)}>Anladım</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
