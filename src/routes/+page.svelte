<script lang="ts">
	let count = 0;
</script>

<div class="h-full w-full flex flex-col gap-2 justify-center items-center">
	<button on:click={() => count++}>click me </button>
	<p>count is {count}</p>
</div>
