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

<section class="flex w-full justify-center flex-col items-center">
	<form
		on:submit|preventDefault={handleSubmit}
		class="grid w-full max-w-sm items-center gap-3 rounded-md p-3"
	>
		<Label for="file-input">File Upload</Label>
		<Input name="file" id="file-input" type="file" accept="text/csv" bind:value={fileState} />
		<Button type="submit">Upload</Button>
	</form>
</section>
