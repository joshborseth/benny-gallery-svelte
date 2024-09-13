<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { toast } from 'svelte-sonner';

	export let data;
	let fileState: File | null = null;
	const handleSubmit = async (e: SubmitEvent) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const file = formData.get('file') as File;

		await fetch(data.url, {
			body: file,
			method: 'PUT',
			headers: {
				'Content-Type': file.type,
				'Content-Disposition': `attachment; filename="${file.name}"`
			}
		});

		toast.success(`${file.name} uploaded successfully`);
		fileState = null;
	};
</script>

<h1 class="text-4xl font-extrabold">Simple WebP Converter</h1>
<form
	on:submit|preventDefault={handleSubmit}
	class="grid w-full max-w-sm items-center gap-3 rounded-md p-8 shadow-md border"
>
	<Label for="file-input" class="text-lg font-bold">Image Upload</Label>
	<Input
		name="file"
		id="file-input"
		type="file"
		accept="image/jpg,image/png"
		bind:value={fileState}
	/>
	<Button type="submit" disabled={!fileState}>Upload</Button>
</form>
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
	<h3 class="text-2xl font-bold col-span-full text-center">Converted Images</h3>
	{#each data.images as image}
		<img src={image.convertedImageUrl} alt={image.convertedImageUrl} width={200} height={200} />
	{/each}
</section>
