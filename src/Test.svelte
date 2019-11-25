<script>
    import { spring } from 'svelte/motion';
    
    export let id;
    export let suit;
    export let rank;
    export let type;
    export let coords;
    export let selected;

    $: rows = [...Array(rank).keys()].reduce((acc, cur) => {
        if (cur % Math.floor(Math.sqrt(rank)) === 0) {            
            acc.push([cur])
        } else {
            acc[acc.length - 1].push(cur)
        }
        return acc;
    }, []);
    // [...Array(Math.floor(Math.sqrt(rank)))].map(row => [...Array(Math.floor(rank / Math.floor(Math.sqrt(rank))))])
</script>

<div class="test" class:selected={selected()} style={`background: ${type === 'serf' ? suit === 'hearts' ? "#f13535" : "#404040" : '#fff'}`}>
    <!-- <div>{coords.x + ' ' + coords.y}</div> -->
    <!-- <div class="color" style={`background: ${r > 0.5 ? "#ffda23" : "#2a58f0"}`}>{id}</div> -->
    {#if type === 'serf'}
        <div class="serf-container">
        {#each rows as row, i}
            <div class="serf-row">
                {#each row as serf, j}
                    <div class="serf"></div>
                {/each}
            </div>
        {/each}
        </div>
    {:else}
    <div class="color" style={`background: ${suit === 'hearts' ? "#f13535" : "#404040"}`}>{rank}</div>
    {/if}
</div>

<style>
    .test {
        background: #fff;
        width: 65px;
        height: 90px;
        border-radius: 10px;
        margin: 5px;
        overflow: hidden;
        box-shadow: 5px 5px 5px #2223;
        transition: box-shadow 0.25s ease, transform 0.25s ease;
        cursor: pointer;
    }
    .test.selected {
        transform: translate(-5px, -5px);
        box-shadow: 12px 12px 5px #2223;
    }
    .color {
        background: #303030;
        height: 80%;
        clip-path: polygon(100% 0, 100% 50%, 0% 100%, 0 0);
        color: #fff;
        /* color: #2227; */
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 3px;
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
    .serf {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: #fff;
        margin: 2px;
    }
</style>