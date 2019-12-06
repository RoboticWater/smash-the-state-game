<script>
	import { Type, Suit } from './cardTypes.js';

	export let selected;
	export let row;
	export let col;
	export let id;
	export let life;
	export let type;
	export let rank;
	export let suit;
	
	const images = {
		SPADES: {
			FACE: ['./images/cards/spades/king-01.png'],
			SERF: [],
		},
		DIAMONDS: {
			FACE: ['./images/cards/spades/king-01.png'],
			SERF: [],
		}
	}
</script>

<div class="item" class:selected={selected} class:red={suit === Suit.DIAMONDS}>
	<!-- {row + "," + col}
	<br>
	{id}
	<br>
	{life} -->
	<img src={images[suit][type][0]} alt="">
</div>

<style>
	.item {
		width: 65px;
		height: 90px;
		background: #eee;
		margin: 5px;
		transition: transform 0.2s ease;
		border-radius: 10px;
		overflow: hidden;
	}
	.item.selected {
		transform: translate(-5px, -5px);
	}
	.red {background: #f43}
	img {
		width: 100%;
	}
</style>