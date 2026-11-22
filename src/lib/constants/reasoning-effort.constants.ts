import { ReasoningEffort } from '$lib/enums';
import type { ReasoningEffortLevel } from '$lib/types';

/**
 * Reasoning effort UI labels.
 * Keys match the ReasoningEffort enum values for type-safe lookups.
 */
export const REASONING_EFFORT_LABELS: Record<string, string> = {
	[ReasoningEffort.DEFAULT]: 'Default',
	[ReasoningEffort.HIGH]: 'High',
	[ReasoningEffort.LOW]: 'Low',
	[ReasoningEffort.MAX]: 'Max',
	[ReasoningEffort.MEDIUM]: 'Medium',
	[ReasoningEffort.OFF]: 'Off'
};

export const REASONING_EFFORT_LEVELS: ReasoningEffortLevel[] = [
	{ label: 'Varsayılan', value: ReasoningEffort.DEFAULT },
	{ label: 'Kapalı', value: ReasoningEffort.OFF },
	{ label: 'Düşük', value: ReasoningEffort.LOW },
	{ label: 'Orta', value: ReasoningEffort.MEDIUM },
	{ label: 'Yüksek', value: ReasoningEffort.HIGH },
	{ hasInfo: true, label: 'En yüksek', value: ReasoningEffort.MAX }
];

/**
 * Reasoning effort to token budget mapping.
 * Maps the ReasoningEffort enum values to concrete token counts for the server.
 */
export const REASONING_EFFORT_TOKENS: Record<string, number> = {
	[ReasoningEffort.HIGH]: 8192,
	[ReasoningEffort.LOW]: 512,
	[ReasoningEffort.MAX]: -1, // unlimited
	[ReasoningEffort.MEDIUM]: 2048
};
