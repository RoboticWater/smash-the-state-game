<script>
	import { Type, Suit } from './cardTypes.js';
	import { generateDeck } from './deck.js';
	import { selection } from './selection.js';

	import Card from './Card.svelte';

	let deck = generateDeck(5);

	let grid = [...Array(5)].map(col => [...Array(10)].map(row => deck.pop()));

	let serfTotal = 0;

	window.addEventListener("touchstart", startMobileSelection, {passive: false});
	// window.addEventListener("touchend", endSelection);

	window.addEventListener("mousedown", startSelection);
	// window.addEventListener("mouseup", endSelection);
	// window.addEventListener("mouseleave", endSelection);

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
		selection.endSelection();
		window.removeEventListener("mousemove", continueSelect);
		window.removeEventListener("touchmove", continueMobileSelect);
		serfTotal = 0;
	}

	function addCard(e, card, row, col) {
		if (!$selection.find(item => item.id === card.id)) {
			serfTotal += card.type === Type.SERF ? card.rank : -card.rank;
			selection.addCard(card, row, col);
		}
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
</script>

<div class="app">
	<div class="top-bar">
	</div>
	<div class="play-area">
		{#each grid as column, col}
			<div class="column">
				{#each column as card, row (card.id)}
					<div class="card-container"
						on:enter={e => addCard(e, card, row, col)}>
						<Card rank={getRank(card)}
							suit={card.suit}
							type={card.type}
							selected={$selection.find(item => item.id === card.id)}
						/>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="bottom-bar">
		{#if $selection.length > 1}
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