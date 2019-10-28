<script>
	import CardTypes from './CardTypes.js'
	import Card from './Card.svelte'

	let id = 0;
	function getCard() {
		return {
			type: CardTypes.QUEEN,
			id: id++,
		}
	}
	function makeGrid(row, col) {
		return [...Array(row)].map(r => [...Array(col)].map(c => getCard()))
	}
	function removeCard(row, col) {
		grid[row][col] = null;
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
				<div class="remove-wrapper" on:click={() => removeCard(y, x)}>
					{#if card}<Card type={card.type} id={card.id} position={{x, y}} />{/if}
				</div>
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
	.remove-wrapper {
		flex: 1;
		display: flex;
	}
</style>