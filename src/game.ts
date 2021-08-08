import { Settings } from "./settings";

let tickLength = Settings.engineTimeResolution;
let lastTick = performance.now();
let lastRender = lastTick;

export function loop(tFrame: number, update: (delta: number) => void, render: () => void) {
    window.requestAnimationFrame(t => loop(t, update, render));
    var nextTick = lastTick + tickLength;
    var numTicks = 0;

    if (tFrame > nextTick) {
        var elapsed = tFrame - lastTick;
        numTicks = Math.floor(elapsed / tickLength);
    }
    
    for (var i = 0; i < numTicks; i++) {
        lastTick += tickLength;
        update(tickLength / 1000);
    }

    render();
    lastRender = tFrame;
}