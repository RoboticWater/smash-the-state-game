<script>
    import { Type, Suit } from './cardTypes.js';

    export let rank;
    export let suit;
    export let type;
    export let selected;
    export let faceTotal = 0;
    
    $: rows = [...Array(rank >= 0 ? rank : 0).keys()].reduce((acc, cur) => {
        if (cur % Math.floor(Math.sqrt(rank)) === 0) {            
            acc.push([cur])
        } else {
            acc[acc.length - 1].push(cur)
        }
        return acc;
    }, []);
</script>

<div class="card" class:selected={selected} class:serf={type === Type.SERF} class:red={suit === Suit.HEARTS}>
    {#if type === Type.SERF}
        <div class="serf-container">
        {#each rows as row, i}
            <div class="serf-row">
                {#each row as serf, j}
                    <div class="dot" class:dead={selected && serf < faceTotal}></div>
                {/each}
            </div>
        {/each}
        </div>
    {/if}
    {#if type === Type.FACE}
        <div class="face">
            <div class="face-display"></div>
            <div class="face-rank">{rank}</div>
        </div>
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
        position: relative;
    }
    .card.serf {
        background: #333;
    }
    .card.serf.red {
        background: #f13535;
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
        position: relative;
    }
    .dot.dead:after {
        content: '';
        width: 150%;
        height: 3px;
        border-radius: 1.5px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        background: #333;
    }
    .red .dot.dead:after {
        background: #f13535;
    }
    .face {
        display: grid;
        grid-template-rows: auto 35%;
        height: 100%;
    }
    .face-display {
    }
    .face-rank {
        /* height: calc(100% - 10px);
        width: calc(100% - 10px); */
        background: #333;
        color: #fff;
        padding: 5px 8px;
        text-align: right;
    }
    .red .face-rank {
        background: #f13535;
    }
</style>