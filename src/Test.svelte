<script>
    import { spring } from 'svelte/motion';
    
    export let id;
    export let suit;
    export let rank;
    export let type;
    export let coords;
    export let selected = false;
</script>

<div class="test" class:selected={selected()} style={`background: ${type === 'serf' ? suit === 'hearts' ? "#f13535" : "#404040" : '#fff'}`}>
    <div class="color" style={`background: ${suit === 'hearts' ? "#f13535" : "#404040"}`}>{type === 'serf' ? rank : ''}</div>
    <!-- <div>{coords.x + ' ' + coords.y}</div> -->
    <!-- <div class="color" style={`background: ${r > 0.5 ? "#ffda23" : "#2a58f0"}`}>{id}</div> -->
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
</style>