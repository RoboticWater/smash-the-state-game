<script>
    export let type;
    export let id;
    export let position;

    function slashStart(e) {

    }
</script>

<div class="card" on:mousedown={slashStart} on:touchstart={slashStart}>
    {type + id}
    {position.x}, {position.y}
</div>

<style>
    .card {
        margin: 5%;
        text-align: center;
		flex: 1;
        background: #eee;
        border-radius: 8px;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }
</style>