<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import Button from '@/components/ui/button/button.svelte';
	import { blur } from 'svelte/transition';

	let inputValue: string;
	let show: boolean = false;
</script>

<div class="h-full w-full flex flex-col gap-2 justify-center items-center">
	<h1 class="text-4xl font-bold">Welcome</h1>
	{#if show}
		<div class="w-full" in:blur={{ duration: 200 }} out:blur={{ duration: 200 }}>
			<Input autofocus bind:value={inputValue} placeholder="Search..." />
		</div>
	{/if}
	<Button on:click={() => (show = !show)}>Toggle</Button>
</div>
