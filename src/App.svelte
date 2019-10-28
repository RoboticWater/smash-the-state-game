<script>
    import { cardSelect } from './stores.js';
	import cardTypes from './cardTypes.js'
	import Card from './Card.svelte'

	let id = 0;
	function getCard() {
		let keys = Object.keys(cardTypes);
		return {
			type: cardTypes[keys[keys.length * Math.random() << 0]],
			id: id++,
		}
	}
	function makeGrid(row, col) {
		return [...Array(row)].map(r => [...Array(col)].map(c => getCard()))
	}
	function removeCard(cards) {
		console.log(cards);
		
		cards.forEach(card => {
			grid[card.position.y][card.position.x] = null;
		})
		handleGravity();
	}
	function handleGravity() {
		console.log(grid);
		
		for (let i = grid.length - 1; i > 0; i--) {
			for (let j = 0; j < grid[0].length; j++) {
				if (!grid[i][j]) {
					grid[i][j] = grid[i - 1][j];
					grid[i - 1][j] = null; 
				}
			}
		}
	}
	let grid = makeGrid(3, 3);
</script>

<div class="play-area">
	{#each grid as row, y}
		<div class="row">
			{#each row as card, x}
				{#if card}
					<Card 
						type={card.type}
						id={card.id}
						position={{x, y}}
						removeCard={removeCard}
						selected={$cardSelect.length > 0 && $cardSelect.find(c => c.id === card.id)} />
				{:else}
					<div class="empty"></div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.play-area {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.row {
		display: flex;
		flex: 1;
	}
	.empty {
		flex: 1;
        margin: 2%;
	}
</style>