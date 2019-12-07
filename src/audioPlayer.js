var sounds = [new sound('./card1.wav'), new sound('./card2.wav'), new sound('./card3.wav')];
let curSound = 0;
export function playEffect() {
    sounds[curSound].play();
    curSound = (curSound + 1) % sounds.length
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.volume = 0.5;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.pause();
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}