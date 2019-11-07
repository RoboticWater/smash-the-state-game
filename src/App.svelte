<script>
	import Test from './Test.svelte';
	import { quintOut, bounceOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	
	const getCard = () => ({id: id++, suit: Math.random() > 0.5 ? 'h' : 'd', rank: Math.random() > 0.2 ? 'k' : 's'});

	let id = 0;
	let grid = [
		[...Array(5)].map(i => getCard()), 
		[...Array(5)].map(i => getCard()), 
		[...Array(5)].map(i => getCard()), 
		[...Array(5)].map(i => getCard()), 
		[...Array(5)].map(i => getCard()), 
	]

	let removed = [null, null, null, null, null]

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	function removeItem(col, id) {
		let i = grid[col].findIndex(elem => elem.id === id);
		removed[col] = i;
		grid[col].splice(i, 1);
		grid[col] = [...grid[col]]
	}
</script>

<div class="app">
	<div class="top-bar">
	</div>
	<div class="play-area">
		{#each grid as column, col}
			<div class="column">
				{#each column as test, i (test.id)}
					<div 
						class="container" 
						on:click={() => removeItem(col, test.id)}
						out:send="{{key: test.id}}"
						animate:flip={{easing: bounceOut, duration: 500, delay: 30 * (removed[col] - i)}}
					><Test {...test} /></div>
				{/each}
				</div>
		{/each}
	</div>
	<div class="bottom-bar"></div>
</div>

<style>
	.app {
		display: grid;
		grid-template-rows: 1fr auto 1fr;
		height: 100%;
		/* background: #222; */
		background: #ddd;
	}
	.play-area {
		display: flex;
		height: 500px;
		width: 375px;
		margin: 0 auto;
	}
	.column {
		display: flex;
		flex-direction: column;
		align-content: flex-end;
		justify-content: flex-end;
		height: 100%;
		width: 75px;
	}
	.container {
		display: inline-block;
	}
</style>