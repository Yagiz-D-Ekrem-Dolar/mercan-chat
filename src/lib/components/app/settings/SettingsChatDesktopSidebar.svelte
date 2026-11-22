<script lang="ts">
	import { ICON_CLASS_DEFAULT } from '$lib/constants';
	import type { SettingsSection, SettingsSectionTitle } from '$lib/types';

	interface Props {
		sections: SettingsSection[];
		isActive: (section: SettingsSection) => boolean;
		onSectionChange?: (section: SettingsSectionTitle) => void;
	}

	let { isActive, onSectionChange, sections }: Props = $props();
</script>

<div class="sticky top-12 hidden w-64 flex-col self-start bg-transparent md:flex gap-6">
	<nav class="space-y-1">
		{#each sections as section (section.title)}
			<button
				class="mercan-nav-item group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm transition-all duration-200 hover:bg-accent/60 {isActive(
					section
				)
					? 'bg-accent text-accent-foreground shadow-sm'
					: 'text-muted-foreground'}"
				data-active={isActive(section)}
				onclick={() => onSectionChange?.(section.title)}
			>
				<span
					class="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-opacity {isActive(
						section
					)
						? 'opacity-100'
						: 'opacity-0'}"
				></span>

				<section.icon
					class="{ICON_CLASS_DEFAULT} transition-colors {isActive(section)
						? 'text-primary'
						: 'group-hover:text-primary/80'}"
				/>

				<span class="ml-1.5">{section.title}</span>
			</button>
		{/each}
	</nav>
</div>
