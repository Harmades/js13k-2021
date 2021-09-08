import { Settings } from "./settings";
import * as Renderer from "./renderer";
import * as Player from "./player";
import * as Enemy from "./enemy";
import * as Bullets from "./bullet";
import * as Tile from "./tile";
import * as MovingTile from "./dynamicTile";
import * as Lava from "./lava";
import * as Timer from "./timer";
import * as Physics from "./physics";
import * as Input from "./input";
import * as World from "./world";
import { floor } from "./alias";
import * as Songs from "./sounds"
import { showStartScreen } from "./ui";

let tickLength = Settings.engineTimeResolution;
let lastTick = performance.now();
let lastRender = lastTick;
let running = false;

World.load();
showStartScreen();
Songs.load();

export function loop(tFrame: number) {
    window.requestAnimationFrame(t => loop(t));
    var nextTick = lastTick + tickLength;
    var numTicks = 0;

    if (tFrame > nextTick) {
        var elapsed = tFrame - lastTick;
        numTicks = floor(elapsed / tickLength);
    }

    for (var i = 0; i < numTicks; i++) {
        lastTick += tickLength;
        update(tickLength / 1000);
    }

    render();
    lastRender = tFrame;
}

export function update(delta: number) {
    if (!running) return;
    Player.update(delta);
    Enemy.update(delta);
    Bullets.update(delta);
    Tile.update(delta);
    MovingTile.update(delta);
    Lava.update(delta);
    Physics.update(delta);
    Input.update(delta);
    Timer.update(delta);
}

export function render() {
    Renderer.render();
}

export function stop() {
    running = false;
}

export function start() {
    running = true;
}