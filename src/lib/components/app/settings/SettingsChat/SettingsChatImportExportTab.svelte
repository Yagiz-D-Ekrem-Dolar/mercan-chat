<script lang="ts">
	import SettingsChatImportExportSection from './SettingsChatImportExportSection.svelte';
	import { Download, Trash2, Upload } from '@lucide/svelte';
	import {
		DialogConfirmation,
		DialogConversationSelection,
		DialogExportSettings
	} from '$lib/components/app';
	import SettingsGroup from '$lib/components/app/settings/SettingsGroup.svelte';
	import { ConversationSelectionMode, FileExtensionText, HtmlInputType } from '$lib/enums';
	import { ConversationTransferService } from '$lib/services';
	import { conversationsStore, settingsStore } from '$lib/stores';
	import { createMessageCountMap } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	let exportedConversations = $state<DatabaseConversation[]>([]);
	let importedConversations = $state<DatabaseConversation[]>([]);
	let showExportSummary = $state(false);
	let showImportSummary = $state(false);

	let showExportDialog = $state(false);
	let showImportDialog = $state(false);
	let availableConversations = $state<DatabaseConversation[]>([]);
	let messageCountMap = $state<Map<string, number>>(new Map());
	let fullImportData = $state<Array<{ conv: DatabaseConversation; messages: DatabaseMessage[] }>>(
		[]
	);

	// Delete functionality state
	let showDeleteDialog = $state(false);

	// Settings import/export state
	let showSettingsExportSummary = $state(false);
	let showSettingsImportSummary = $state(false);
	let showSettingsExportDialog = $state(false);
	let includeSensitiveData = $state(false);

	function handleSettingsExport() {
		showSettingsExportDialog = true;
		includeSensitiveData = false;
	}

	function handleSettingsExportConfirm() {
		showSettingsExportDialog = false;

		try {
			const data = settingsStore.exportSettings(includeSensitiveData);
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			a.href = url;
			a.download = `llama_settings_${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			showSettingsExportSummary = true;
			showSettingsImportSummary = false;
			toast.success('Ayarlar dışa aktarıldı');
		} catch (err) {
			console.error('Failed to export settings:', err);
			toast.error('Ayarlar dışa aktarılamadı');
		}
	}

	function handleSettingsExportCancel() {
		showSettingsExportDialog = false;
	}

	function handleSettingsImport() {
		try {
			const input = document.createElement('input');

			input.type = HtmlInputType.FILE;
			input.accept = FileExtensionText.JSON;

			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement)?.files?.[0];

				if (!file) return;

				try {
					const text = await file.text();
					const data = JSON.parse(text);

					if (!data || typeof data !== 'object' || !data.config) {
						toast.error('Geçersiz ayar dosyası: yapılandırma yok');

						return;
					}

					settingsStore.importSettings(data);

					showSettingsImportSummary = true;
					showSettingsExportSummary = false;
					toast.success('Ayarlar içe aktarıldı');
				} catch (err) {
					console.error('Failed to import settings:', err);
					toast.error('Ayarlar içe aktarılamadı');
				}
			};

			input.click();
		} catch (err) {
			console.error('Failed to open file picker:', err);
			toast.error('Dosya seçici açılamadı');
		}
	}

	async function handleExportClick() {
		try {
			const allConversations = conversationsStore.conversations;

			if (allConversations.length === 0) {
				toast.info('Dışa aktarılacak sohbet yok');

				return;
			}

			const conversationsWithMessages = await Promise.all(
				allConversations.map(async (conv: DatabaseConversation) => {
					const messages = await conversationsStore.getConversationMessages(conv.id);

					return { conv, messages };
				})
			);

			messageCountMap = createMessageCountMap(conversationsWithMessages);
			availableConversations = allConversations;
			showExportDialog = true;
		} catch (err) {
			console.error('Failed to load conversations:', err);
			alert('Sohbetler yüklenemedi');
		}
	}

	async function handleExportConfirm(selectedConversations: DatabaseConversation[]) {
		try {
			const allData = await conversationsStore.getConversationsForExport(
				selectedConversations.map((conv) => conv.id)
			);

			if (allData.length === 1) {
				ConversationTransferService.downloadConversationFile(allData[0]);
			} else {
				ConversationTransferService.downloadConversationsArchive(allData);
			}

			exportedConversations = selectedConversations;
			showExportSummary = true;
			showImportSummary = false;
			showExportDialog = false;
		} catch (err) {
			console.error('Export failed:', err);
			alert('Sohbetler dışa aktarılamadı');
		}
	}

	async function handleImportClick() {
		try {
			const input = document.createElement('input');

			// No `accept` filter: iOS resolves each entry to a UTI and has none for
			// `.jsonl`, which greys out exported conversations in the file picker.
			// `parseImportFile` detects the format from the file contents instead.
			input.type = HtmlInputType.FILE;

			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement)?.files?.[0];

				if (!file) return;

				try {
					const importedData = await ConversationTransferService.parseImportFile(file);

					if (importedData.length === 0) {
						throw new Error('No conversations found in file');
					}

					fullImportData = importedData;
					availableConversations = importedData.map((item) => item.conv);
					messageCountMap = createMessageCountMap(importedData);
					showImportDialog = true;
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : 'Unknown error';

					console.error('Failed to parse file:', err);
					alert(`Dosya okunamadı: ${message}`);
				}
			};

			input.click();
		} catch (err) {
			console.error('Import failed:', err);
			alert('Sohbetler içe aktarılamadı');
		}
	}

	async function handleImportConfirm(selectedConversations: DatabaseConversation[]) {
		try {
			const selectedIds = new Set(selectedConversations.map((c) => c.id));
			const selectedData = $state
				.snapshot(fullImportData)
				.filter((item) => selectedIds.has(item.conv.id));
			const { imported, skipped } = await conversationsStore.importConversationsData(selectedData);

			// A conversation already in the database is left untouched, so the summary
			// lists what was written and the toast accounts for the rest.
			if (skipped.length > 0) {
				toast.info(
					`${skipped.length} sohbet kitaplığında zaten olduğu için atlandı`
				);
			}

			importedConversations = imported;
			showImportSummary = true;
			showExportSummary = false;
			showImportDialog = false;
		} catch (err) {
			console.error('Import failed:', err);
			alert('Sohbetler içe aktarılamadı. Dosya biçimini kontrol et.');
		}
	}

	async function handleDeleteAllClick() {
		try {
			const allConversations = conversationsStore.conversations;

			if (allConversations.length === 0) {
				toast.info('Silinecek sohbet yok');

				return;
			}

			showDeleteDialog = true;
		} catch (err) {
			console.error('Failed to load conversations for deletion:', err);
			toast.error('Sohbetler yüklenemedi');
		}
	}

	async function handleDeleteAllConfirm() {
		try {
			await conversationsStore.deleteAll();

			showDeleteDialog = false;
		} catch (err) {
			console.error('Failed to delete conversations:', err);
		}
	}

	function handleDeleteAllCancel() {
		showDeleteDialog = false;
	}
</script>

<div in:fade={{ duration: 150 }} class="space-y-12">
	<SettingsGroup title="Sohbetler">
		<SettingsChatImportExportSection
			IconComponent={Download}
			buttonText="Sohbetleri dışa aktar"
			description="Sohbetlerini JSONL dosyalarından oluşan bir ZIP olarak indir. Tüm mesajları, ekleri ve sohbet geçmişini içerir."
			onclick={handleExportClick}
			summary={{ items: exportedConversations, show: showExportSummary, verb: 'Dışa aktarıldı' }}
			title="Dışa aktar"
		/>

		<SettingsChatImportExportSection
			IconComponent={Upload}
			buttonText="Sohbetleri içe aktar"
			description="Daha önce dışa aktarılmış bir ZIP ya da JSONL dosyasından sohbetleri içe aktar. Mevcut sohbetlerinle birleştirilir."
			onclick={handleImportClick}
			summary={{ items: importedConversations, show: showImportSummary, verb: 'İçe aktarıldı' }}
			title="İçe aktar"
		/>

		<SettingsChatImportExportSection
			IconComponent={Trash2}
			buttonClass="text-destructive-foreground justify-start justify-self-start bg-destructive hover:bg-destructive/80 md:w-auto"
			buttonText="Tüm sohbetleri sil"
			buttonVariant="destructive"
			description="Tüm sohbetleri ve mesajlarını kalıcı olarak sil. Bu işlem geri alınamaz. Yedek istiyorsan önce dışa aktar."
			onclick={handleDeleteAllClick}
			title="Tümünü sil"
			titleClass="text-destructive"
		/>
	</SettingsGroup>

	<SettingsGroup title="Ayarlar">
		<SettingsChatImportExportSection
			IconComponent={Download}
			buttonText="Ayarları dışa aktar"
			description="Sohbet ayarlarını ve tercihlerini JSON dosyası olarak dışa aktar."
			onclick={handleSettingsExport}
			summary={{ items: [], show: showSettingsExportSummary, verb: 'Dışa aktarıldı' }}
			title="Dışa aktar"
		/>

		<SettingsChatImportExportSection
			IconComponent={Upload}
			buttonText="Ayarları içe aktar"
			description="Daha önce dışa aktarılmış JSON dosyasından ayarları içe aktar. Mevcut ayarlarınla birleştirilir."
			onclick={handleSettingsImport}
			summary={{ items: [], show: showSettingsImportSummary, verb: 'İçe aktarıldı' }}
			title="İçe aktar"
		/>
	</SettingsGroup>
</div>

<DialogExportSettings
	bind:includeSensitiveData
	bind:open={showSettingsExportDialog}
	onCancel={handleSettingsExportCancel}
	onConfirm={handleSettingsExportConfirm}
/>

<DialogConversationSelection
	bind:open={showExportDialog}
	conversations={availableConversations}
	{messageCountMap}
	mode={ConversationSelectionMode.EXPORT}
	onCancel={() => (showExportDialog = false)}
	onConfirm={handleExportConfirm}
/>

<DialogConversationSelection
	bind:open={showImportDialog}
	conversations={availableConversations}
	{messageCountMap}
	mode={ConversationSelectionMode.IMPORT}
	onCancel={() => (showImportDialog = false)}
	onConfirm={handleImportConfirm}
/>

<DialogConfirmation
	bind:open={showDeleteDialog}
	cancelText="Vazgeç"
	confirmText="Tümünü sil"
	description="Tüm sohbetleri silmek istediğine emin misin? Bu işlem geri alınamaz; tüm sohbetlerin ve mesajların kalıcı olarak silinir."
	icon={Trash2}
	onCancel={handleDeleteAllCancel}
	onConfirm={handleDeleteAllConfirm}
	title="Tüm sohbetleri sil"
	variant="destructive"
/>
