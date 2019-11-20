<script>
    import { onMount } from 'svelte'
	import { cardSelect } from './stores.js'
	import Test from './Test.svelte';
	import { quintOut, bounceOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';


    var audioSources = [];
    onMount(() => {
        audioSources.push(new Audio('./card.wav'));
        audioSources.push(new Audio('./card.wav'));
        audioSources.push(new Audio('./card.wav'));
        audioSources.push(new Audio('./card.wav'));
    })

	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
	
	const Deck = () => ([
		...[...Array(2)].map(i => Card(1, Suit.CLUBS, Type.SERF)),
		...[...Array(2)].map(i => Card(2, Suit.CLUBS, Type.SERF)),
		...[...Array(1)].map(i => Card(1, Suit.CLUBS, Type.SERF)),
		...[...Array(1)].map(i => Card(1, Suit.CLUBS, Type.SERF)),
		...[...Array(2)].map(i => Card(1, Suit.CLUBS, Type.FACE)),
		...[...Array(2)].map(i => Card(2, Suit.CLUBS, Type.FACE)),
		...[...Array(2)].map(i => Card(3, Suit.CLUBS, Type.FACE)),
		...[...Array(2)].map(i => Card(4, Suit.CLUBS, Type.FACE)),
		...[...Array(2)].map(i => Card(1, Suit.HEARTS, Type.SERF)),
		...[...Array(2)].map(i => Card(2, Suit.HEARTS, Type.SERF)),
		...[...Array(1)].map(i => Card(1, Suit.HEARTS, Type.SERF)),
		...[...Array(1)].map(i => Card(1, Suit.HEARTS, Type.SERF)),
		...[...Array(2)].map(i => Card(1, Suit.HEARTS, Type.FACE)),
		...[...Array(2)].map(i => Card(2, Suit.HEARTS, Type.FACE)),
		...[...Array(2)].map(i => Card(3, Suit.HEARTS, Type.FACE)),
		...[...Array(2)].map(i => Card(4, Suit.HEARTS, Type.FACE)),
	]);

	

	const Suit = {
		CLUBS: 'clubs',
		HEARTS: 'hearts',
		DIAMONDS: 'diamonds',
		SPADES: 'clubs',
	}

	const Type = {
		SERF: 'serf',
		FACE: 'face'
	}

	let id = 0;
	const Card = (rank, suit, type) => ({id: id++, rank, suit, type})

	// const getCard = () => ({id: id++, suit: Math.random() > 0.5 ? 'h' : 'c', rank: Math.random() > 0.3 ? 'f' : 's', size: 1 + (Math.random() * 4) << 0});
	let deck = shuffle([...Array(2)].reduce((acc, cur) => acc.concat(Deck()), []))
	let grid = [
		[...Array(10)].map(i => deck.pop()), 
		[...Array(10)].map(i => deck.pop()), 
		[...Array(10)].map(i => deck.pop()), 
		[...Array(10)].map(i => deck.pop()), 
		[...Array(10)].map(i => deck.pop()), 
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

	function playEffect() {
		let audioSource = audioSources.find(as => !as.paused);
		if (!audioSource) {
			audioSources.push(new Audio('./card.wav'));
			audioSource = audioSources[audioSources.length -1]
		}
		audioSource.volume = 0.5 *  Math.random() + 0.5;
		audioSource.playbackRate = 0.5 *  Math.random() + 0.5;
		audioSource.play();
	}

	function removeItem(col, id) {
		let i = grid[col].findIndex(elem => elem.id === id);
		// removed[col] = i;
		grid[col].splice(i, 1);
		let card = deck.pop()
		if (card)
			grid[col] = [card, ...grid[col]]
		else
			grid[col] = [{}, ...grid[col]]
	}

	function startSelect(e, col, row) {
		let card = grid[col][row];
		if (card.type === Type.FACE  && ($cardSelect.length === 0 || !validNextCard(col, row)))
			return;
		console.log("START SELECT");
		
		playEffect()

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
		let card = grid[col][row];
		let serfCount = $cardSelect.reduce((acc, cur) => acc + cur.type === Type.SERF ? 1 : 0, 0);
		if (serfCount > 1 && card.type !== Type.SERF || serfCount === 1 && card.type === Type.SERF)
			return;
		console.log("CONTINUE SELECT");
		
		let i = $cardSelect.findIndex(c => c.id === card.id);
		console.log(i >= 0 ? "	REMOVING CARD" : "	ADDING CARD");
		if (i >= 0) {
			cardSelect.removeCardIndex($cardSelect.length - 1);
		} else {
			if (card.suit !== $cardSelect[$cardSelect.length - 1].suit)
				return;
			playEffect()
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
		if ($cardSelect.length < 2) {
			cardSelect.reset();
			return;
		}

		if ($cardSelect.every(card => card.type === Type.SERF)) {
			let serfVal = $cardSelect.reduce((acc, cur) => acc + cur.rank, 0);
			let card = $cardSelect[$cardSelect.length - 1];
			grid[card.col][card.row].rank = serfVal;
			for (let i = 0; i < $cardSelect.length - 1; i++) {
				card = $cardSelect[i];
				removed[card.col] = removed[card.col] < card.row ? card.row : removed[card.col];
				removedCount[card.col]++;
			}
			for (let i = 0; i < $cardSelect.length - 1; i++) {
				card = $cardSelect[i];
				removeItem(card.col, card.id);
			}
			cardSelect.reset();
		} else {
			let curSerf;
			let serfs = []
			let groups = $cardSelect.reduce((acc, cur) => {
				if (cur.type === Type.SERF) {
					curSerf = cur.id;
					serfs.push(cur);
					acc[curSerf] = []
				} else {
					acc[curSerf].push(cur)
				}
				return acc;
			}, {})

			let valid = true;
			serfs.forEach(serf => {
				if (!groups[serf.id].every(card => card.suit === serf.suit)) {
					valid = false;
				}
			})

			if (!valid) {
				cardSelect.reset();
				return;
			}
			
			$cardSelect.forEach(card => {
				removed[card.col] = removed[card.col] < card.row ? card.row : removed[card.col];
				removedCount[card.col]++;
			});
			
			$cardSelect.forEach(card => {
				removeItem(card.col, card.id);
			});
			cardSelect.reset();
		};
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
						<Test selected={() => $cardSelect.some(card => card.id === test.id)} {...test} coords={{x: col, y: row}}/>
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