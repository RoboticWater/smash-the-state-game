<script>
	import { Type, Suit } from './cardTypes.js';
	
	export let selected;
	export let id;
	export let life;
	export let type;
	export let rank;
	export let suit;
	export let lifeTotal;
	
	const images = {
		SPADES: {
			FACE: [
				'./images/cards/spades/jack-01.png',
				'./images/cards/spades/queen-01.png',
				'./images/cards/spades/king-01.png',
				'./images/cards/spades/ace-01.png'
			],
			SERF: [
				'./images/cards/spades/1-01.png',
				'./images/cards/spades/2-01.png',
				'./images/cards/spades/3-01.png',
				'./images/cards/spades/4-01.png',
				'./images/cards/spades/5-01.png',
				'./images/cards/spades/6-01.png',
				'./images/cards/spades/7-01.png',
				'./images/cards/spades/8-01.png',
				'./images/cards/spades/9-01.png',
				'./images/cards/spades/10-01.png',
			],
		},
		DIAMONDS: {
			FACE: [
				'./images/cards/diamonds/jack-01.png',
				'./images/cards/diamonds/queen-01.png',
				'./images/cards/diamonds/king-01.png',
				'./images/cards/diamonds/ace-01.png'
			],
			SERF: [
				'./images/cards/diamonds/1-01.png',
				'./images/cards/diamonds/2-01.png',
				'./images/cards/diamonds/3-01.png',
				'./images/cards/diamonds/4-01.png',
				'./images/cards/diamonds/5-01.png',
				'./images/cards/diamonds/6-01.png',
				'./images/cards/diamonds/7-01.png',
				'./images/cards/diamonds/8-01.png',
				'./images/cards/diamonds/9-01.png',
				'./images/cards/diamonds/10-01.png',
			],
		}
	}
</script>

<div
	class="item"
	style={`opacity: ${life / lifeTotal};`}
	class:selected={selected}
    class:serf={type === Type.SERF}
    class:red={suit === Suit.DIAMONDS}>
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