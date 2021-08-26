import { input } from "./input";
import { Rectangle } from "./rectangle";
import { drawImage, drawRect, loadImage } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";
import Charac_Cowboy from "../asset/characters/charac_cowboy.png";
import Charac_Cowboy_Walkframe from "../asset/characters/charac_cowboy_walkframe.png";
import { spawn } from "./bullets";

export type Player = Rectangle & {
    speed: Vector;
    state: PlayerState
}

export type PlayerState = "idle" | "running" | "coyote" | "airborne"

let gunReloading = false;
let currentCoyoteFrame = 0;
let currentGravity = 0;
const idleSprite = loadImage(Charac_Cowboy);
const walkSprite = loadImage(Charac_Cowboy_Walkframe);
let currentSprite = idleSprite;
let walkCycleFrequency = Settings.playerWalkCycleFrequency;
let currentCycle = 0;
let flipped = false;

export const player: Player = {
    x: 20,
    y: 30,
    width: 15,
    height: 16,
    speed: { x: 0, y: 0 },
    state: "airborne"
}

export function render() {
    if (player.state == "running") {
        currentCycle++;
        if (currentCycle == walkCycleFrequency) {
            currentCycle = 0;
            currentSprite = currentSprite == idleSprite ? walkSprite : idleSprite;
        }
        flipped = player.speed.x < 0;
    }
    if (player.state == "idle") {
        currentSprite = idleSprite;
    }
    drawImage(currentSprite, player, flipped);
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

    player.speed.y += currentGravity * delta;
    if (input.up && player.state != "airborne") player.speed.y = -Settings.playerSpeedY;
    if (input.left) player.speed.x = -Settings.playerSpeedX;
    else if (input.right) player.speed.x = Settings.playerSpeedX;
    else player.speed.x = 0;

    if (input.space && !gunReloading) {
        const xOffset = flipped ? -8 : Settings.playerBulletSpawnOffsetX;
        spawn({ x: player.x + xOffset, y: player.y + Settings.playerBulletSpawnOffsetY }, { x: flipped ? -1 : 1, y: 0 });
        gunReloading = true;
    }
    if (!input.space) gunReloading = false;

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