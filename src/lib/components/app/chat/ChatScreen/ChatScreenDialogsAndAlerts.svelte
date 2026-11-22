<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import {
		DialogChatError,
		DialogConfirmation,
		DialogEmptyFileAlert,
		DialogFileUploadError
	} from '$lib/components/app';
	import { ErrorDialogType } from '$lib/enums';

	let {
		activeErrorDialog,
		emptyFileNames,
		fileUpload,
		handleDeleteConfirm,
		handleErrorDialogOpenChange,
		showDeleteDialog,
		showEmptyFileDialog
	} = $props();
</script>

<DialogFileUploadError
	bind:open={fileUpload.showFileErrorDialog}
	fileErrorData={fileUpload.fileErrorData}
/>

<DialogConfirmation
	bind:open={showDeleteDialog}
	cancelText="Cancel"
	confirmText="Delete"
	description="Bu sohbeti silmek istediğine emin misin? Bu işlem geri alınamaz; sohbetteki tüm mesajlar kalıcı olarak silinir."
	icon={Trash2}
	onCancel={() => (showDeleteDialog = false)}
	onConfirm={handleDeleteConfirm}
	title="Sohbeti sil"
	variant="destructive"
/>

<DialogEmptyFileAlert
	bind:open={showEmptyFileDialog}
	emptyFiles={emptyFileNames}
	onOpenChange={(open) => {
		if (!open) {
			emptyFileNames = [];
		}
	}}
/>

<DialogChatError
	contextInfo={activeErrorDialog?.contextInfo}
	message={activeErrorDialog?.message ?? ''}
	onOpenChange={handleErrorDialogOpenChange}
	open={Boolean(activeErrorDialog)}
	type={activeErrorDialog?.type ?? ErrorDialogType.SERVER}
/>
