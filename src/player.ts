import { input } from "./input";
import { Rectangle } from "./rectangle";
import { drawAsset } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Player = Rectangle & { speed: Vector; state: PlayerState }

export type PlayerState = "idle" | "running" | "coyote" | "airborne"

let currentCoyoteFrame = 0;
let currentGravity = 0;

export const player: Player = {
    x: 20,
    y: 30,
    width: 15,
    height: 16,
    speed: { x: 0, y: 0 },
    state: "airborne"
}

export function render() {
    // drawAtlas(atlasPosition, player);
    drawAsset("player", player);
}

export function update(delta: number) {
    if (player.state == "idle" && player.speed.x != 0) player.state = "running";
    if (player.state == "idle" && player.speed.y != 0) player.state = "airborne";
    if (player.state == "running" && player.speed.y > 0) player.state = "coyote";
    if (player.state == "running" && player.speed.y < 0) player.state = "airborne";
    if (player.state == "coyote" && player.speed.y < 0) player.state = "airborne";
    if (player.state == "coyote" && player.speed.y > 0) {
        if (currentCoyoteFrame == Settings.playerCoyoteFrames) {
            player.state = "airborne";
            currentCoyoteFrame = 0;
        }
        else currentCoyoteFrame++;
    }
    if (player.state == "running" && player.speed.x == 0 && player.speed.y == 0) player.state = "idle";
    if (player.state == "airborne" && currentGravity == 0 && player.speed.y == 0) player.state = "running";

    document.getElementById("debug")!.innerText = player.state;

    player.speed.y += currentGravity * delta;
    if (input.up && player.state != "airborne") player.speed.y = -Settings.playerSpeedY;
    if (input.left) player.speed.x = -Settings.playerSpeedX;
    else if (input.right) player.speed.x = Settings.playerSpeedX;
    else player.speed.x = 0;

    player.x += player.speed.x * delta;
    player.y += player.speed.y * delta;

    currentGravity = Settings.gravity;
}

export function collide(translationVector: Vector) {
    if (translationVector.x != 0) {
        player.speed.x = 0
    }
    if (translationVector.y < 0) {
        currentGravity = 0;
        player.speed.y = 0;
    }
}