<script>
	import { cardSelect } from './stores.js'
	import Test from './Test.svelte';
	import { quintOut, bounceOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	
	const getCard = () => ({id: id++, suit: Math.random() > 0.5 ? 'h' : 'c', rank: Math.random() > 0.3 ? 'f' : 's'});

	let id = 0;
	let grid = [
		[...Array(10)].map(i => getCard()), 
		[...Array(10)].map(i => getCard()), 
		[...Array(10)].map(i => getCard()), 
		[...Array(10)].map(i => getCard()), 
		[...Array(10)].map(i => getCard()), 
	]

	let removed = [null, null, null, null, null]
	let removedCount = [0, 0, 0, 0, 0]

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
		// removed[col] = i;
		grid[col].splice(i, 1);
		grid[col] = [getCard(), ...grid[col]]
	}

	function startSelect(e, col, row) {
		let card = grid[col][row];
		if (card.rank === 'f' && ($cardSelect.length === 0 || !validNextCard(col, row)))
			return;
		console.log("START SELECT");
		
		cardSelect.addCard(Object.assign({col, row}, card))
		// console.log($cardSelect);
		// console.log($cardSelect.reduce((acc, cur) => acc + cur.rank + cur.suit + " ", ""));
		window.addEventListener('mouseup', endSelect);
		removed = [null, null, null, null, null]
		removedCount = [0, 0, 0, 0, 0]
		console.log($cardSelect);
	}

	function continueSelect(e, col, row) {
		console.log();
		
		if ($cardSelect.length === 0 || !validNextCard(col, row))
			return;
		console.log("CONTINUE SELECT");
		let card = grid[col][row];
		let i = $cardSelect.findIndex(c => c.id === card.id);
		console.log(i >= 0 ? "	REMOVING CARD" : "	ADDING CARD");
		if (i >= 0) {
			cardSelect.removeCardIndex($cardSelect.length - 1);
		} else {
			cardSelect.addCard(Object.assign({col, row}, card))
		}
		// console.log($cardSelect);
		// console.log($cardSelect.reduce((acc, cur) => acc + cur.rank + cur.suit + " ", ""));
	}

	function endSelect(e) {
		window.removeEventListener('mouseup', endSelect);
		console.log("ENDING SELECT");
		// console.log($cardSelect);
		console.log($cardSelect.reduce((acc, cur) => acc + cur.rank + cur.suit + " ", ""));
		$cardSelect.forEach(card => {
			removed[card.col] = removed[card.col] < card.row ? card.row : removed[card.col];
			removedCount[card.col]++;
		});
		
		$cardSelect.forEach(card => {
			removeItem(card.col, card.id);
		});
		cardSelect.reset();
	}

	function validNextCard(col, row) {
		let prevCard = $cardSelect[$cardSelect.length - 1];
		return Math.abs(prevCard.row - row) <= 1 && Math.abs(prevCard.col - col) <= 1;
	}
</script>

<!-- on:click={e => removeItem(col, test.id)} -->
<div class="app">
	<div class="top-bar">
	</div>
	<div class="play-area">
		{#each grid as column, col}
			<div class="column">
				{#each column as test, row (test.id)}
					<div 
						class="container" 
						out:send="{{key: test.id}}"
						class:hidden={row < 5}
						animate:flip={{easing: bounceOut, duration: 300 + 200 * removedCount[col], delay: 30 * (removed[col] - row)}}
					>
						<Test selected={() => $cardSelect.some(card => card.id === test.id)} {...test}/>
						<div class="select-zone"
							on:mousedown={e => startSelect(e, col, row)}
							on:mouseenter={e => continueSelect(e, col, row)}
						></div>
					</div>
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
		background: #acd0db;
	}
	.play-area {
		display: flex;
		height: 500px;
		width: 375px;
		margin: 0 auto;
		overflow: hidden;
		padding: 5px;
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
		position: relative;
		user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-webkit-user-select: none;
	}
	.container.hidden {
		opacity: 0;
	}
	.select-zone {
		background: #0f0;
		opacity: 0;
		width: 65px;
		height: 95px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		z-index: 100;
	}
	.select-zone:hover {
		background: #ff0;
	}
	.top-bar {
		/* background: #222; */
		/* position: fixed; */
		/* z-index: 2000;
		box-shadow: #2224  */
	}
</style>