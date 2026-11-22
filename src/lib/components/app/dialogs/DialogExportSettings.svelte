<script lang="ts">
	import { Shield, ShieldOff } from '@lucide/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';

	let {
		includeSensitiveData = $bindable(false),
		onCancel,
		onConfirm,
		open = $bindable()
	}: {
		open: boolean;
		includeSensitiveData: boolean;
		onCancel: () => void;
		onConfirm: () => void;
	} = $props();

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			onCancel();
		}
	}
</script>

<AlertDialog.Root onOpenChange={handleOpenChange} {open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2">
				{#if includeSensitiveData}
					<ShieldOff class="h-5 w-5 text-destructive" />
				{:else}
					<Shield class="h-5 w-5 text-destructive" />
				{/if}
				Export Settings
			</AlertDialog.Title>

			<AlertDialog.Description>
				{#if includeSensitiveData}
					<p class="text-amber-500">
						Uyarı: Bu dışa aktarma API anahtarları ve MCP özel başlıkları (örn. yetkilendirme token'ları) gibi hassas veriler içerir. Bu dosyayı güvenmediğin kimseyle paylaşma.
					</p>
				{:else}
					<p>
						Bilgilerini korumak için hassas veriler (API anahtarları, MCP özel başlıkları) dışa aktarmaya dahil edilmez.
					</p>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="flex items-center gap-2 py-2">
			<Checkbox bind:checked={includeSensitiveData} id="include-sensitive" />

			<Label
				class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				for="include-sensitive"
			>
				{#if includeSensitiveData}
					<span class="text-destructive">Hassas verileri dahil et (önerilmez)</span>
				{:else}
					<span>Hassas verileri dahil et</span>
				{/if}
			</Label>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={onCancel}>Vazgeç</AlertDialog.Cancel>

			<AlertDialog.Action
				class="bg-destructive text-white hover:bg-destructive/80"
				onclick={onConfirm}
			>
				{#if includeSensitiveData}
					Export Anyway
				{:else}
					Export Without Sensitive Data
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
