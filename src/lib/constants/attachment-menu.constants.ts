import { FILE_TYPE_ICONS } from '$lib/constants';
import { AttachmentAction, AttachmentItemEnabledWhen, AttachmentMenuItemId } from '$lib/enums';
import type { AttachmentMenuItem } from '$lib/types';

/**
 * File attachment menu items shown in both the desktop dropdown and mobile sheet.
 * The "Tools" submenu is handled separately by each component.
 */
export const ATTACHMENT_FILE_ITEMS: AttachmentMenuItem[] = [
	{
		action: AttachmentAction.FILE_UPLOAD,
		class: 'images-button',
		disabledTooltip: 'Görsel işleme için görüntü destekleyen bir model gerekir',
		enabledWhen: AttachmentItemEnabledWhen.HAS_VISION_MODALITY,
		icon: FILE_TYPE_ICONS.image,
		id: AttachmentMenuItemId.IMAGES,
		label: 'Görseller'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		class: 'audio-button',
		disabledTooltip: 'Ses dosyası işleme için ses destekleyen bir model gerekir',
		enabledWhen: AttachmentItemEnabledWhen.HAS_AUDIO_MODALITY,
		icon: FILE_TYPE_ICONS.audio,
		id: AttachmentMenuItemId.AUDIO,
		label: 'Ses dosyaları'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		class: 'video-button',
		disabledTooltip: 'Video işleme için video destekleyen bir model gerekir',
		enabledWhen: AttachmentItemEnabledWhen.HAS_VIDEO_MODALITY,
		icon: FILE_TYPE_ICONS.video,
		id: AttachmentMenuItemId.VIDEO,
		label: 'Video dosyaları'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		icon: FILE_TYPE_ICONS.text,
		id: AttachmentMenuItemId.TEXT,
		label: 'Metin dosyaları'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		disabledTooltip: "PDF dosyaları metne dönüştürülür. Görsel tabanlı PDF dosyaları düzgün çalışmayabilir.",
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		hasEnabledTooltip: true,
		icon: FILE_TYPE_ICONS.pdf,
		id: AttachmentMenuItemId.PDF,
		label: 'PDF dosyaları'
	}
];

export const ATTACHMENT_TOOLTIP_TEXT = 'Dosya ekle ya da sistem mesajını düzenle';
