<script>
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { quintOut, bounceOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { generateDeck } from './deck.js';
	import Item from './Item.svelte'
	let id = 0;
	let deck = generateDeck(2);
	// let grid = [...Array(5)].map(row => [...Array(5)].map(col => ({col, row, id: id++, life: (Math.random() * 40 << 0) + 5})));
	let grid = [...Array(5)].map(row => [...Array(10)].map(col => deck.pop()));
	let selectedItems = [];
	function toggle(row, id) {
		let i = selectedItems.findIndex(item => item.id === id)
		if (i < 0) {
			selectedItems = [...selectedItems, {row, id}]
		} else {
			selectedItems = selectedItems.slice(0, i).concat(selectedItems.slice(i + 1, selectedItems.length))
		}
	}
	function remove(row, id) {
		let col = grid[row].findIndex(item => item.id === id);
		// grid[row] = grid[row].slice(0, col).concat(grid[row].slice(col + 1, grid[row].length))
		grid[row].splice(col, 1);
		let card = deck.pop()
		grid[row] = card ? [card, ...grid[row]] : [...grid[row]]
	}
	function removeAll() {
		selectedItems.forEach(item => {
			remove(item.row, item.id);
		})
		selectedItems = []
	}
	
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
	
	onMount(() => {
		const interval = setInterval(() => {
			grid.forEach((row, x) => {
				row.forEach((item, y) => {
					if (grid[x][y]) {
						// grid[x][y].life--;
						if (grid[x][y].life < 0)
							remove(x, grid[x][y].id)
					}
				})
			})
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="main">
	<div class="top"></div>
	<div class="board">
	{#each grid as row, x (x)}
		<div class="row" animate:flip={{easing: quintOut, duration: 500, delay: 50}}>
		{#each row as item, y (item.id)}
			<div on:click={() => toggle(x, item.id)}
				out:send="{{key: item.id}}"
				animate:flip={{easing: bounceOut, duration: 500, delay: 50}}>
				<Item type={item.type} rank={item.rank} suit={item.suit} row={x} col={y} life={item.life} id={item.id} selected={selectedItems.find(i => i.id === item.id)}/>
			</div>
		{/each}
		</div>
	{/each}
	</div>
	<div class="bottom">
		<button on:click={removeAll}>
			Remove All	
		</button>
	</div>
</div>

<style>
	.row {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-content: flex-end;
	}
	.main {
		display: grid;
		grid-template-areas: "top top top" ". board ." "bottom bottom bottom";
		grid-template-rows: 1fr auto 1fr;
		height: 100%;
	}
	.board {
		grid-area: board;
		justify-self: center;
		align-self: center;
		display:flex;
		height: 500px;
		overflow: hidden;
		width: 100%;
		justify-content: center;
	}
	.top {
		grid-area: top;
	}
	.bottom {
		grid-area: bottom;
	}
</style>