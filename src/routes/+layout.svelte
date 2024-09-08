<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<Toaster />
<main class="max-w-3xl mx-auto min-h-screen flex items-center">
	<slot />
</main>
