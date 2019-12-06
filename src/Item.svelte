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
	export let lifeTotal;
	
	const images = {
		SPADES: {
			FACE: ['./images/cards/spades/jack-01.png', './images/cards/spades/queen-01.png', './images/cards/spades/king-01.png', './images/cards/spades/ace-01.png'],
			SERF: [],
		},
		DIAMONDS: {
			FACE: ['./images/cards/diamonds/jack-01.png', './images/cards/diamonds/queen-01.png', './images/cards/diamonds/king-01.png', './images/cards/diamonds/ace-01.png'],
			SERF: [],
		}
	}
</script>

<div
	class="item"
	style={`opacity: ${life / lifeTotal};`}
	class:selected={selected}
    class:serf={type === Type.SERF}
    class:red={suit === Suit.DIAMONDS}>
	<!-- {row + "," + col}
	<br>
	{id}
	<br>
	{life} -->
	<img src={images[suit][type][rank - 1]} alt="">
</div>

<style>
	.item {
		width: 65px;
		height: 90px;
		background: #fff;
		margin: 5px;
		transition: transform 0.15s ease, opacity 500ms ease;
		border-radius: 10px;
		overflow: hidden;
	}
	.item.selected {
		transform: translate(-5px, -5px);
	}
	.serf {background: #171515;}
	.serf.red {background: #EE2331}
	img {
		width: 100%;
	}
</style>