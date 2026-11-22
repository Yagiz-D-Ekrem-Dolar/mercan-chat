<script lang="ts">
	import { ArrowRight, Copy, Edit, GitBranch, RefreshCw, Trash2 } from '@lucide/svelte';
	import { ActionIcon, ChatMessageActionIconsBranchingControls } from '$lib/components/app';
	import { Switch } from '$lib/components/ui/switch';
	import { getChatMessageActionsContext, getChatMessageEditContext } from '$lib/contexts';
	import { MessageRole } from '$lib/enums';
	import { conversationsStore } from '$lib/stores';

	interface Props {
		role: MessageRole.USER | MessageRole.ASSISTANT;
		justify: 'start' | 'end';
		actionsPosition: 'left' | 'right';
		onRegenerate?: () => void;
		onContinue?: () => void;
		showRawOutputSwitch?: boolean;
		rawOutputEnabled?: boolean;
		onRawOutputToggle?: (enabled: boolean) => void;
	}

	let {
		actionsPosition,
		justify,
		onContinue,
		onRawOutputToggle,
		onRegenerate,
		rawOutputEnabled = false,
		role,
		showRawOutputSwitch = false
	}: Props = $props();

	const messageActions = getChatMessageActionsContext();
	const editCtx = getChatMessageEditContext();

	// Onay penceresi yok: sil düğmesi doğrudan siler.
	function handleDelete() {
		messageActions.confirmDelete();
	}

	// Ad sorulmaz: sohbet, bu mesajdan doğrudan dallanır.
	function handleFork() {
		const conv = conversationsStore.activeConversation;

		messageActions.forkConversation?.({
			includeAttachments: true,
			name: `${conv?.name ?? 'Sohbet'} (dal)`
		});
	}
</script>

<div class="relative {justify === 'start' ? 'mt-2' : ''} flex min-h-8 items-center justify-between">
	<div
		class="{actionsPosition === 'left'
			? 'left-0'
			: 'right-0'} flex items-center gap-2 opacity-100 transition-opacity"
	>
		{#if messageActions.siblingInfo && messageActions.siblingInfo.totalSiblings > 1}
			<ChatMessageActionIconsBranchingControls />
		{/if}

		<div class="mercan-actions pointer-events-auto">
			<ActionIcon
				class="mercan-action"
				icon={Copy}
				iconSize="h-3.5 w-3.5"
				onclick={messageActions.copy}
				tooltip="Kopyala"
			/>

			{#if role === MessageRole.USER}
				<ActionIcon
					class="mercan-action"
					icon={Edit}
					iconSize="h-3.5 w-3.5"
					onclick={editCtx.startEdit}
					tooltip="Düzenle"
				/>
			{/if}

			{#if role === MessageRole.ASSISTANT && onRegenerate}
				<ActionIcon
					class="mercan-action"
					icon={RefreshCw}
					iconSize="h-3.5 w-3.5"
					onclick={() => onRegenerate()}
					tooltip="Yeniden üret"
				/>
			{/if}

			{#if role === MessageRole.ASSISTANT && onContinue}
				<ActionIcon
					class="mercan-action"
					icon={ArrowRight}
					iconSize="h-3.5 w-3.5"
					onclick={onContinue}
					tooltip="Devam et"
				/>
			{/if}

			{#if messageActions.forkConversation}
				<ActionIcon
					class="mercan-action"
					icon={GitBranch}
					iconSize="h-3.5 w-3.5"
					onclick={handleFork}
					tooltip="Dallandır"
				/>
			{/if}

			<span aria-hidden="true" class="mercan-actions__sep"></span>

			<ActionIcon
				class="mercan-action mercan-action--danger"
				icon={Trash2}
				iconSize="h-3.5 w-3.5"
				onclick={handleDelete}
				tooltip="Sil"
			/>
		</div>
	</div>

	{#if showRawOutputSwitch}
		<div class="flex items-center gap-2">
			<span class="text-xs text-muted-foreground">Ham çıktıyı göster</span>

			<Switch
				checked={rawOutputEnabled}
				onCheckedChange={(checked) => onRawOutputToggle?.(checked)}
			/>
		</div>
	{/if}
</div>
