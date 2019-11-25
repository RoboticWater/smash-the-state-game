var sounds = [new sound('./card1.wav'), new sound('./card2.wav'), new sound('./card3.wav')];
let prevSound = 0;
export function playEffect() {
    let index = (Math.random() * sounds.length) << 0;
    while (index === prevSound) {
        index = (Math.random() * sounds.length) << 0
    }
    prevSound = index;
    let sound = sounds[index];
    sound.play();
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