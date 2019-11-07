<script>
    export let id;
    export let suit;
    export let rank;
</script>

<div class="test" style={`background: ${rank === 's' ? suit === 'h' ? "#333" : "#f02a2a" : '#fff'}`}>
    <div class="color" style={`background: ${suit === 'h' ? "#333" : "#f02a2a"}`}>{id}</div>
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
    .test:hover {
        transform: translate(-5px, -5px);
        box-shadow: 12px 12px 5px #2223;
    }
    .color {
        background: #f02a2a;
        height: 80%;
        clip-path: polygon(100% 0, 100% 50%, 0% 100%, 0 0);
        color: #fff;
        /* color: #2227; */
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 3px;
    }
</style>