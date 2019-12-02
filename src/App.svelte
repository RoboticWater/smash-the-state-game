<script>
	import { quintOut, bounceOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import { Type, Suit } from './cardTypes.js';
	import { generateDeck } from './deck.js';
	import { selection } from './selection.js';
	import { playEffect } from './audioPlayer.js';
    import { tick, onMount } from 'svelte';

	import Card from './Card.svelte';

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

	let deck = generateDeck(5);

	let grid = [...Array(5)].map(col => [...Array(10)].map(row => deck.pop()));

	let serfTotal = 0;
	let faceTotal = 0;

	window.addEventListener("touchstart", startMobileSelection, {passive: false});
	// window.addEventListener("touchend", endSelection);

	window.addEventListener("mousedown", startSelection);
	// window.addEventListener("mouseup", endSelection);
	// window.addEventListener("mouseleave", endSelection);

	let removed = [null, null, null, null, null]
	let removedCount = [0, 0, 0, 0, 0]

	let serfDeaths = 0;
	let faceDeaths = 0;

	function removeCard(col, id) {
		let i = grid[col].findIndex(card => card.id === id);
		if (i < 0)
			return;
		if (grid[col][i].type === Type.SERF) {
			serfDeaths++;
		} else {
			faceDeaths++;
		}
		grid[col].splice(i, 1);
		let card = deck.pop()
		grid[col] = card ? [card, ...grid[col]] : [{}, ...grid[col]]
	}

	function startMobileSelection(e, card, row, col) {
		e.preventDefault();		
		continueMobileSelect(e);
		// selection.addCard(card, row, col);
		window.addEventListener("touchmove", continueMobileSelect);
	}

	function startSelection(e) {
		e.preventDefault();
		continueSelect(e);
		// selection.addCard(card, row, col);
		window.addEventListener("mousemove", continueSelect);
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

	function endSelection(e, cancel=false) {
		e.preventDefault();
		curElement = null;

		removed = [null, null, null, null, null]
		removedCount = [0, 0, 0, 0, 0]

		if (!cancel && $selection.length > 1) {
			if (allSerfs) {
				let card = $selection[$selection.length - 1];
				grid[card.col][card.row].rank = serfTotal;
				grid[card.col][card.row].curLife = serfTotal * 100;
				grid[card.col][card.row].life = serfTotal * 100;
				for (let i = 0; i < $selection.length - 1; i++) {
					card = $selection[i];
					removed[card.col] = removed[card.col] < card.row ? card.row : removed[card.col];
					removedCount[card.col]++;
				}
				for (let i = 0; i < $selection.length - 1; i++) {
					card = $selection[i];
					removeCard(card.col, card.id);
				}
			} else if (faceTotal <= serfTotal) {
				let card = $selection[$selection.length - 1];
				for (let i = 0; i < $selection.length; i++) {
					card = $selection[i];
					removed[card.col] = removed[card.col] < card.row ? card.row : removed[card.col];
					removedCount[card.col]++;
				}
				for (let i = 0; i < $selection.length; i++) {
					card = $selection[i];
					removeCard(card.col, card.id);
				}
			}
		}
		selection.endSelection();
		window.removeEventListener("mousemove", continueSelect);
		window.removeEventListener("touchmove", continueMobileSelect);
		serfTotal = 0;
		faceTotal = 0;
		curSuit = null;
	}

	let curSuit;
	function addCard(e, card, row, col) {
		if ($selection.find(item => item.id === card.id)
			|| !validNextCard(row, col)
			|| (curSuit && curSuit !== card.suit)
			|| serfTotal - faceTotal + (card.type === Type.SERF ? card.rank : -1) < 0)
			return;
			curSuit = card.suit;
		window.navigator.vibrate(50);
		if (card.type === Type.SERF)
			serfTotal += card.rank;
		else 
			faceTotal += 1;
		selection.addCard(card, row, col);
		playEffect();
	}

	function validNextCard(row, col) {
		if (!$selection.length)
			return true;
		let prevCard = $selection[$selection.length - 1];
		return Math.abs(prevCard.row - row) <= 1 && Math.abs(prevCard.col - col) <= 1;
	}

	$: getRank = card => {
		if (card.type === Type.SERF) {
			let i = $selection.findIndex(item => item.id === card.id)
			if (i >= 0) {
				let lastSerf;
				$selection.forEach((c, index) => { if (c.type === Type.SERF) lastSerf = index;});
				return i === lastSerf ? serfTotal : 0;
			}
		}
		return card.rank;
	}

	$: allSerfs = $selection.every(card => card.type === Type.SERF);


	onMount(() => {
		const interval = setInterval(() => {
			for (let x = 0; x < grid.length; x++) {
				for (let y = 0; y < grid[0].length; y++) {
					if (grid[x][y].type === Type.SERF && y > 4) {
						grid[x][y].curLife -= 3;
					}
					if (grid[x][y].curLife < 0) {
						removed[x] = removed[x] < y ? y : removed[x];
						removedCount[x]++;
						removeCard(x, grid[x][y].id);
					}
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="app">
	<div class="top-bar">
	</div>
	<div class="play-area">
		{#each grid as column, col}
			<div class="column">
				{#each column as card, row (card.id)}
					<div class="card-container"
						out:send="{{key: card.id}}"
						on:enter={e => addCard(e, card, row, col)}
						animate:flip={{easing: bounceOut, duration: 500, delay: 50}}>
						{#if card !== {}} 
							<Card rank={getRank(card)}
								suit={card.suit}
								type={card.type}
								curLife={card.curLife}
								selected={$selection.find(item => item.id === card.id)}
								faceTotal={faceTotal}
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="bottom-bar">
		{#if $selection.length}
			<button class="smash" on:click={endSelection} on:touchstart={endSelection}>
				{#if allSerfs}
				<img src="./handshake.svg" alt="">
				{:else}
				<img src="./fist.svg" alt="">
				{/if}
				<!-- https://thenounproject.com/search/?q=fist&i=577562 -->
				<!-- https://thenounproject.com/term/handshake/29611/ -->
			</button>
			<button class="cancel" on:click={e => endSelection(e, true)} on:touchstart={e => endSelection(e, true)}>
				<img src="./cancel.svg" alt="">
				<!-- https://thenounproject.com/search/?q=cancel&i=1890784 -->
			</button>
		{/if}
	</div>
</div>

<style>
	.app {
		background: #a0c9c9;
		display: grid;
		grid-template-rows: 1fr auto 1fr;
		height: 100%;
		width: 100%;
	}
	.play-area {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		grid-gap: 5px;
		height: 500px;
		width: 100%;
		max-width: 375px;
		padding: 2.5px 5px;
		overflow: hidden;
		justify-self: center;
	}
	.column {
		display: flex;
		flex-direction: column;
		align-content: flex-end;
		justify-content: flex-end;
		height: 100%;
		/* overflow: hidden; */
		/* width: 75px; */
	}
	.card-container {
		width: 100%;
		height: calc(20% - 5px);
		padding: 2.5px 0;
		flex-shrink: 0;
		
		user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
	}
	.bottom-bar {
		display: flex;
		max-height: 60px;
		max-width: 375px;
		justify-self: center;
		width: 100%;
	}
	.bottom-bar button {
		flex: 1;
		margin: 2.5px;
        border-radius: 10px;
		background: #333;
		border: none;
	}
	.bottom-bar img {
		height: 40px;
		margin-top: 3px;
	}
</style>