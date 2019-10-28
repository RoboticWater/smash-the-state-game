<script>
    import {  onDestroy } from 'svelte'
    import { cardSelect } from './stores.js';

    export let type;
    export let id;
    export let position;
    export let removeCard;
    export let selected = false;

    function slashStart(e) {
        console.log(1);
        
        cardSelect.addCard({ type, id, position })
        window.addEventListener('mouseup', slashEnd);
        console.log($cardSelect);
        
    }

    function slashEnd(e) {
        removeCard($cardSelect);
        cardSelect.reset();
    }

    function slashEnter(e) {
        if ($cardSelect.length > 0) {
            cardSelect.addCard({ type, id, position })
        }
    }

    onDestroy(() => {
		window.removeEventListener('mouseup', slashEnd);
    })
</script>

<div class="card"
    class:selected={selected}
    on:mousedown={slashStart}
    on:mouseenter={slashEnter}
    on:touchstart={slashStart}>
    {type + id}
    {position.x}, {position.y}
</div>

<style>
    .card {
        margin: 2%;
        text-align: center;
		flex: 1;
        background: #eee;
        border-radius: 8px;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        transition: background 0.3s ease, margin 0.3s ease;
    }
    .card.selected {
        background: #e34;
        margin: 4%;
    }
</style>