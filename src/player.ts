import { input } from "./input";
import { Rectangle } from "./rectangle";
import { drawAtlas } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Player = Rectangle & { speed: Vector; state: PlayerState }

export type PlayerState = "idle" | "running" | "airborne"

export const player: Player = {
    x: 20,
    y: 30,
    width: 8,
    height: 8,
    speed: { x: 0, y: 0 },
    state: "idle"
}

const atlasPosition: Vector = {
    x: 0,
    y: 16
};

export function render() {
    drawAtlas(atlasPosition, player);
}

export function update(delta: number) {
    if (player.speed.x != 0) player.state = "running";
    if (player.speed.y != 0) player.state = "airborne";
    if (player.speed.x == 0 && player.speed.y == 0) player.state = "idle";

    player.speed.y += Settings.gravity
    if (input.up && player.state != "airborne") player.speed.y = -Settings.playerSpeedY;
    if (input.left) player.speed.x = -Settings.playerSpeedX;
    else if (input.right) player.speed.x = Settings.playerSpeedX;
    else player.speed.x = 0;

    player.x += player.speed.x * delta;
    player.y += player.speed.y * delta;
}

export function collide() {
    player.speed.y = 0;
}