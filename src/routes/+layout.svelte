<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster />
<main class="max-w-3xl mx-auto min-h-screen py-10 flex gap-10 items-center flex-col justify-center">
	<slot />
</main>
