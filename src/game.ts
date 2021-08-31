import { Settings } from "./settings";
import * as Renderer from "./renderer";
import * as Player from "./player";
import * as Enemy from "./enemy";
import * as Bullets from "./bullet";
import * as Platform from "./platform";
import * as Physics from "./physics";
import * as Input from "./input";
import * as World from "./world";
import { floor } from "./alias";

World.load();

let tickLength = Settings.engineTimeResolution;
let lastTick = performance.now();
let lastRender = lastTick;

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
    Player.update(delta);
    Enemy.update(delta);
    Bullets.update(delta);
    Platform.update(delta);
    Physics.update(Player.player, Platform.platforms, Enemy.enemies);
    Input.update(delta);
}

export function render() {
    Renderer.render();
}