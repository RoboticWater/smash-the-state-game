<script>
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { quintOut, bounceOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import Item from './Item.svelte'
	import { Type, Suit } from './cardTypes.js';
	import { generateDeck } from './deck.js';

	let id = 0;
	let deck = generateDeck(2);
	// let grid = [...Array(5)].map(row => [...Array(5)].map(col => ({col, row, id: id++, life: (Math.random() * 40 << 0) + 5})));
	// let grid = [...Array(5)].map(row => [...Array(10)].map(col => deck.pop()));
	let gridid = 0;
	let grid = [...Array(5)].map(row => ({items: [...Array(10)].map(col => deck.pop()), id: 'g' + gridid++}));
	console.log(grid);
	
	let selectedItems = [];
	function toggle(row, id) {
		let i = selectedItems.findIndex(item => item.id === id)
		if (i < 0) {
			selectedItems = [...selectedItems, {row, id}]
		}
	}
	function remove(row, id) {
		let col = grid[row].items.findIndex(item => item.id === id);
		// grid[row].items = grid[row].items.slice(0, col).concat(grid[row].items.slice(col + 1, grid[row].items.length))
		grid[row].items.splice(col, 1);
		let card = deck.pop()
		grid[row].items = card ? [card, ...grid[row].items] : [...grid[row].items]
		
	}
	function removeAll() {
		selectedItems.forEach(item => {
			remove(item.row, item.id);
		})
		selectedItems = []
		removeEmptyColumns();
	}

	function removeEmptyColumns() {
		grid = grid.filter(col => col.items.length > 0)
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
				row.items.forEach((item, y) => {
					if (y > 4 && grid[x].items[y] && grid[x].items[y].type === Type.SERF) {
						grid[x].items[y].life--;
						if (grid[x].items[y].life < 0)
							remove(x, grid[x].items[y].id)
					}
				})
			})
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	// window.addEventListener("touchstart", startMobileSelection, {passive: false});
	// window.addEventListener("touchend", endSelection);
	window.addEventListener("mousedown", startSelection);
	window.addEventListener("mouseup", endSelection);
	// window.addEventListener("mouseleave", endSelection);

	let serfTotal = 0;
	let faceTotal = 0;
	let curSuit;

	
	function startSelection(e) {
		e.preventDefault();
		continueSelect(e);
		window.addEventListener("mousemove", continueSelect);
	}
	function continueSelect(e) {
		let {clientX, clientY} = e;
		if (e.buttons === 0)
			return;
		let element  = document.elementFromPoint(clientX, clientY);
		if (curElement !== element) {
			curElement = element;
			curElement.dispatchEvent(new CustomEvent('enter', {
				bubbles: true,
			}));
		}
	}
	// function startMobileSelection(e, card, row, col) {
	// 	e.preventDefault();		
	// 	continueMobileSelect(e);
	// 	window.addEventListener("touchmove", continueMobileSelect);
	// }
	let curElement;
	// function continueMobileSelect(e) {
	// 	let {clientX, clientY} = e.targetTouches[0];
	// 	let element = document.elementFromPoint(clientX, clientY);
	// 	if (element && curElement !== element) {
	// 		curElement = element;
	// 		curElement.dispatchEvent(new CustomEvent('enter', {
	// 			bubbles: true,
	// 		}));
	// 	}
	// }
	function endSelection(e, cancel=false) {
		e.preventDefault();
		curElement = null;
		window.removeEventListener("mousemove", continueSelect);
		// window.removeEventListener("touchmove", continueMobileSelect);
		serfTotal = 0;
		faceTotal = 0;
		curSuit = null;
		removeAll()
	}
</script>

<div class="main">
	<div class="top"></div>
	<div class="board">
	{#each grid as row, x (row.id)}
		<div class="row" animate:flip={{easing: quintOut, duration: 500, delay: 50}}>
		{#each row.items as item, y (item.id)}
			<div out:send="{{key: item.id}}"
				on:enter={() => toggle(x, item.id)}
				animate:flip={{easing: bounceOut, duration: 500, delay: 50}}>
				<Item 
					type={item.type}
					rank={item.rank}
					suit={item.suit}
					row={x} col={y}
					life={item.life}
					lifeTotal={item.lifeTotal}
					id={item.id}
					selected={selectedItems.find(i => i.id === item.id)}/>
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
		/* background: #8ec0ab; */
		background: #9ea09f;
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