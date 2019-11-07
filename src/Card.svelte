<script>
    import { onDestroy, beforeUpdate, onMount } from 'svelte'
	import { spring } from 'svelte/motion';
    import { cardSelect } from './stores.js';

    export let type;
    export let id;
    export let position;
    export let removeCard;
    export let selected = false;    

    let ref;
    let pos = {};

    const coords = spring({x: position.x * 70, y: position.y * 90}, {
		stiffness: 0.05,
		damping: 0.3
	});

    var audioSource;

    onMount(() => {
        audioSource = new Audio('./card.wav');
        // coords.set({x: rect.x, y: rect.y});
    })

    beforeUpdate(() => {
        // console.log(1);
        // if (position.x * 70 !== pos.x || position.y * 90 !== pos.y) {
        //     pos = {x: position.x * 70, y: position.y * 90}
		//     coords.update($coords => pos);
        // }
        // coords.stiffness = 0.05;
        // coords.damping = 0.3;
        // let rect = ref.getBoundingClientRect();
        // coords.set({x: rect.x, y: rect.y});
    })

    function slashStart(e) {
        if (type.status === 'face') {
            return;
        }
        audioSource.volume = 0.5 *  Math.random() + 0.5;
        audioSource.play();
        cardSelect.addCard({ type, id, position })
        window.addEventListener('mouseup', slashEnd);
    }

    function slashEnd(e) {
        // if ($cardSelect.every(card => card.type === $cardSelect[0].type)) {
        //     removeCard($cardSelect);
        // }
        if ($cardSelect.length < 2) {
            cardSelect.reset();
            return;
        }
        if ($cardSelect.length === 2) {
            if ($cardSelect[0].type.name == 1) {
                removeCard($cardSelect);
            }
            cardSelect.reset();
            return;
        }
        let curNumber = parseInt($cardSelect[0].type.name) - 1;
        
        let curType = $cardSelect[1].type
        
        for (let i = 2; i < $cardSelect.length; i++) {
            console.log(curNumber, curType, $cardSelect[i].type);
            if (curNumber-- === 0) {
                curNumber = parseInt($cardSelect[i].type.name);
                if (i + 2 > $cardSelect.length) {
                    console.log(2);
                    cardSelect.reset();
                    return;
                }
                curType = $cardSelect[i + 1].type;
                continue;
            }
            if ($cardSelect[i].type !== curType) {
                console.log(1);
                
                cardSelect.reset();
                return;
            }
        }
        removeCard($cardSelect);
        cardSelect.reset();
    }

    function slashEnter(e) {
        if ($cardSelect.length > 0) {
            audioSource.volume = 0.5 *  Math.random() + 0.5;
            audioSource.play();
            cardSelect.addCard({ type, id, position })
        }
    }

    onDestroy(() => {
		window.removeEventListener('mouseup', slashEnd);
    })
</script>

<div class="card"
    bind:this={ref}
    class:selected={selected}
    on:mousedown={slashStart}
    on:mouseenter={slashEnter}
    on:touchstart={slashStart}>
    <div class="content">
        {type.name}:{id}
        <hr>
        {position.x}, {position.y}
    </div>
</div>

<style>
    .card {
        width: 65px;
        height: 95px;
        margin: 5px;
    }
    .content {
        text-align: center;
        background: #eee;
        border-radius: 8px;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        transition: background 0.3s ease, margin 0.3s ease;
        width: 65px;
        height: 95px;
    }
    .card.selected .content {
        background: #e34;
        animation: shake 0.25s linear infinite;
    }
    .card.selected hr {
        border: #9c1a25 solid 1px;
    }
    @keyframes shake {
        0% {
            transform: none;
        }
        25% {
            transform: rotate(10deg);
        }
        50% {
            transform: rotate(0deg);
        }
        75% {
            transform: rotate(-10deg);
        }
        100% {
            transform: none;
        }
    }
</style>