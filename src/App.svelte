<script>
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { quintOut, quartOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import Item from './Item.svelte'
	import { Type, Suit } from './cardTypes.js';
	import { generateDeck } from './deck.js';
	import { selection } from './selection.js';
	import { playEffect } from './audioPlayer.js';

	let id = 0;
	let deck = generateDeck(5);
	let gridid = 0;
	let grid = [...Array(5)].map(row => ({items: [...Array(10)].map(col => {
		let card = deck.pop()
		return card ? card : {}
	}).reverse(), id: 'g' + gridid++}));
	let gameOverState = 0;
	document.cookie = "smashed=0;"
	

	// function toggle(row, id) {
	// 	let i = $selection.findIndex(item => item.id === id)
	// 	if (i < 0) {
	// 		$selection = [...$selection, {row, id}]
	// 	}
	// }
	
	function remove(col, id) {
		let row = grid[col].items.findIndex(item => item.id === id);
		if (row === -1)
			return;
		// grid[col].items = grid[col].items.slice(0, col).concat(grid[col].items.slice(col + 1, grid[col].items.length))
		grid[col].items.splice(row, 1);
		let card = deck.pop()
		grid[col].items = card ? [card, ...grid[col].items] : [{}, ...grid[col].items]
		
	}

	function removeEmptyColumns() {
		grid = grid.filter(col => col.items.some(item => item.suit))
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
			let movesRemaining = false;
			let anyFaces = false;
			grid.forEach((row, x) => {
				row.items.forEach((item, y) => {
					if (hasMoves(grid[x].items[y], x, y)) {
						movesRemaining = true;
					}
					anyFaces = anyFaces || grid[x].items[y].type === Type.FACE;
					if (y > grid[x].items.length - 6 && grid[x].items[y] && grid[x].items[y].type === Type.SERF) {
						grid[x].items[y].life--;
						if (grid[x].items[y].life < 0)
							remove(x, grid[x].items[y].id)
					}
				})
			})
			console.log(anyFaces);
			
			if (!movesRemaining) {
				gameOverState++;
				clearInterval(interval);
				gameOverSequence(anyFaces);
			}
			removeEmptyColumns();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	window.addEventListener("touchstart", startMobileSelection, {passive: false});
	window.addEventListener("touchend", endSelection);
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
	function startMobileSelection(e, card, row, col) {
		e.preventDefault();		
		continueMobileSelect(e);
		window.addEventListener("touchmove", continueMobileSelect);
	}
	let curElement;
	function continueMobileSelect(e) {
		let {clientX, clientY} = e.targetTouches[0];
		let element = document.elementFromPoint(clientX, clientY);
		if (element && curElement !== element) {
			curElement = element;
			curElement.dispatchEvent(new CustomEvent('enter', {
				bubbles: true,
			}));
		}
	}
	function endSelection(e, cancel=false) {
		e.preventDefault();
		curElement = null;

		if (!cancel && $selection.length > 1) {
			if (allSerfs) {
				let card = $selection[$selection.length - 1];
				grid[card.col].items[card.row].rank = serfTotal;
				grid[card.col].items[card.row].curLife = serfTotal * 100;
				grid[card.col].items[card.row].life = serfTotal * 100;
				for (let i = 0; i < $selection.length - 1; i++) {
					card = $selection[i];
					remove(card.col, card.id);
				}
			} else if (faceTotal <= serfTotal) {
				let card = $selection[$selection.length - 1];
				for (let i = 0; i < $selection.length; i++) {
					card = $selection[i];
					remove(card.col, card.id);
				}
			}
		}
		selection.endSelection()
		removeEmptyColumns();

		window.removeEventListener("mousemove", continueSelect);
		window.removeEventListener("touchmove", continueMobileSelect);
		serfTotal = 0;
		faceTotal = 0;
		curSuit = null;		
	}

	$: allSerfs = $selection.every(card => card.type === Type.SERF);

	$: getRank = card => {
		if (card.type === Type.SERF) {
			let i = $selection.findIndex(c => c.id === card.id)
			if (i >= 0) {
				let lastSerf;
				$selection.forEach((c, index) => { if (c.type === Type.SERF) lastSerf = index;});
				return i === lastSerf ? serfTotal - faceTotal : 0;
			}
		}
		return card.rank;
	}

	function addCard(col, row, card) {
		if ($selection.find(item => item.id === card.id)
			|| !validNextCard(col, row)
			|| (curSuit && curSuit !== card.suit)
			|| serfTotal - faceTotal + (card.type === Type.SERF ? card.rank : -1) < 0)
			return;
		curSuit = card.suit;
		window.navigator.vibrate(50);
		if (card.type === Type.SERF)
			serfTotal += card.rank;
		else 
			faceTotal += 1;
		selection.addCard(col, row, card)
		playEffect();
	}
	function validNextCard(col, row) {
		if (!$selection.length)
			return true;
		let prevCard = $selection[$selection.length - 1];
		return Math.abs(prevCard.row - row) <= 1 && Math.abs(prevCard.col - col) <= 1;
	}
	function hasMoves(card, col, row) {
		if (card.type === Type.FACE || !card.suit) {
			return false;
		}
		let validCard = false;
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				if (x === 0 && y === 0)
					continue;
				if (col + x < 0 || col + x >= grid.length || row + y < 0 || row + y >= grid[col].items.length)
					continue;			
				let other = grid[col + x].items[row + y];
				if (card.suit === other.suit) {
					validCard = true;
					break;
				}
			}
			if (validCard)
				break;
		}
		// .forEach(x => {
		// 	[-1, 1].forEach(y => {
		// 		if (col + x < 0 || col + x >= grid.length || row + y < 0 || row + y >= grid[col].items.length)
		// 			return true;				
		// 		let other = grid[col + x].items[row + y];
		// 		if (card.suit === other.suit) {
		// 			validCard = true;
		// 			return;
		// 		}
		// 	})
		// 	if (validCard)
		// 		return;
		// })
		return validCard;
	}
	function gameOverSequence(failure) {
		setTimeout(() => {
			gameOverState++
		}, 500)
		setTimeout(() => {
			console.log(failure);
			
			if (!failure) {
				document.cookie = "smashed=" + (++smashed) + ";" 
			}
			console.log(document.cookie);
		}, 1000)
	}

	let smashed = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)smashed\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
	let facesSmashed = 0;
	let serfsSacrificed = 0;
	
</script>

<div class="main">
	<div class="top">
		<div>Faces Smashed: <span class="states">{facesSmashed.toString().padStart(5, '0')}</span></div>
		<div>Serfs Sacrificed: <span class="states">{serfsSacrificed.toString().padStart(5, '0')}</span></div>
	</div>
	<div class="board">
	{#each grid as col, x (col.id)}
		<div class="column" animate:flip={{easing: quintOut, duration: 500}}>
		{#each col.items as card, y (card.id)}
			<div class="container" out:send="{{key: card.id}}"
				animate:flip={{easing: quartOut, duration: 300}}>
				{#if card.suit}
					<Item 
						type={card.type}
						rank={getRank(card)}
						suit={card.suit}
						life={card.life}
						lifeTotal={card.lifeTotal}
						id={card.id}
						selected={$selection.find(i => i.id === card.id)}/>
					<div class="selector" on:enter={() => addCard(x, y, card)}></div>
				{/if}
			</div>
		{/each}
		</div>
	{/each}
	</div>
</div>
<div class="game-over" class:on={gameOverState > 0}>
	<div class="content">
		<div class="smashed">States Smashed: <span class="states">{smashed.toString().padStart(5, '0')}</span></div>
	</div>
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-content: flex-end;
	}
	.main {
		display: grid;
		grid-template-areas: ". top ." ". board ." "bottom bottom bottom";
		grid-template-rows: 1fr auto 1fr;
		height: 100%;
		/* background: #8ec0ab; */
		/* background: #a1bfdb; */
		/* background: #97beae; */
		background: #d6d6d6;
	}
	.container {
		position: relative;
	}
	.selector {
		position: absolute;
		top: 10px;
		left: 10px;
		right: 10px;
		bottom: 10px;
		/* background: #0f0; */
		border-radius: 100%;
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
	.game-over {
		opacity: 0;
		position: fixed;
		z-index: 1000;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #000;
		transition: opacity 0.35s ease;
		pointer-events: none;
		color: #fff;
	}
	.on {
		pointer-events: all;
		opacity: 1;
	}
	.content {
		text-transform: uppercase;
		width: 200px;
		margin: 50px auto;
	}
	.states {
		font-weight: 300;
	}
</style>