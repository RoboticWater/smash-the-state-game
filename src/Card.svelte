<script>
    import { Type, Suit } from './cardTypes.js';

    export let rank;
    export let suit;
    export let type;
    export let selected;
    
    $: rows = [...Array(rank >= 0 ? rank : 0).keys()].reduce((acc, cur) => {
        if (cur % Math.floor(Math.sqrt(rank)) === 0) {            
            acc.push([cur])
        } else {
            acc[acc.length - 1].push(cur)
        }
        return acc;
    }, []);
</script>

<div class="card" class:selected={selected} class:serf={type === Type.SERF}>
    {#if type === Type.SERF}
        <div class="serf-container">
        {#each rows as row, i}
            <div class="serf-row">
                {#each row as serf, j}
                    <div class="dot"></div>
                {/each}
            </div>
        {/each}
        </div>
    {/if}
    {#if type === Type.FACE}
        <div>{rank}</div>
    {/if}
</div>

<style>
    .card {
        width: 100%;
        height: 100%;
        /* width: 65px;
        height: 90px; */
        background: #fff;
        border-radius: 10px;
        /* margin: 5px; */
        overflow: hidden;
        /* box-shadow: 5px 5px 5px #2223; */
        transition: box-shadow 0.25s ease, transform 0.25s ease;
        cursor: pointer;
    }
    .card.serf {
        background: #333;
    }
    .card.selected {
        transform: translate(-5px, -5px);
        /* background: #f00; */
        /* box-shadow: 12px 12px 5px #2223; */
    }
    .serf-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        flex-direction: column;
    }
    .serf-row {
        display: flex;
    }
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: #fff;
        margin: 2px;
    }
</style>