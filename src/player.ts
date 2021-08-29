import { createReleasedKeyPress, input } from "./input";
import { Rectangle } from "./rectangle";
import { draw, Sprite } from "./renderer";
import { Settings } from "./settings";
import { Vector, zero } from "./vector";
import { spawn } from "./bullet";
import { createCounter } from "./animation";
import { track } from "./camera";

export type Player = Rectangle & {
    speed: Vector;
    state: PlayerState;
    combatState: PlayerCombatState;
    cows: number;
}

export type PlayerState = "idle" | "running" | "coyote" | "airborne" | "dash"
export type PlayerCombatState = "human" | "cow"

const humanIdleSprite = "charac_cowboy.png";
const humanWalkSprite = "charac_cowboy_walkframe.png";
const cowIdleSprite = "charac_cow.png";
const cowWalkSprite = "charac_cow_walkframe.png";
const cowDashSprite = "charac_cow_dashframe.png";
let currentSprite: Sprite = humanIdleSprite;

let currentGravity = 0;
let flipped = false;
let dashExhausted = false;
let currentSpawn = { x: Settings.playerSpawnX, y: Settings.playerSpawnY };
const coyoteCounter = createCounter(Settings.playerCoyoteFrames);
const walkCounter = createCounter(Settings.playerWalkCycleFrames);
const dashCounter = createCounter(Settings.playerDashFrames);
const morphKeyPress = createReleasedKeyPress("m");
const shootKeyPress = createReleasedKeyPress("space");
const dashKeyPress = createReleasedKeyPress("shift");

export const player: Player = {
    x: Settings.playerSpawnX,
    y: Settings.playerSpawnY,
    w: 15,
    h: 16,
    speed: { x: 0, y: 0 },
    state: "airborne",
    combatState: "human",
    cows: 0
}

export function render() {
    const idleSprite = player.combatState == "human" ? humanIdleSprite : cowIdleSprite;
    const walkSprite = player.combatState == "human" ? humanWalkSprite : cowWalkSprite;
    if (player.state == "running") {
        if (walkCounter()) {
            currentSprite = currentSprite == idleSprite ? walkSprite : idleSprite;
        }
    }
    if (player.state == "idle" || player.state == "airborne" || player.state == "coyote") {
        currentSprite = idleSprite;
    }
    if (player.state == "dash") {
        currentSprite = cowDashSprite;
    }
    if (player.speed.x != 0) flipped = player.speed.x < 0;
    draw(currentSprite, player, flipped);
}

export function update(delta: number) {
    if (player.state == "idle" && player.speed.x != 0) player.state = "running";
    if (player.state == "idle" && player.speed.y != 0) player.state = "airborne";
    if (player.state == "running" && player.speed.y > 0) player.state = "coyote";
    if (player.state == "running" && player.speed.y < 0) player.state = "airborne";
    if (player.state == "coyote" && player.speed.y < 0) player.state = "airborne";
    if (player.state == "coyote" && player.speed.y > 0) {
        if (coyoteCounter()) {
            player.state = "airborne";
        }
    }
    if (player.state == "running" && player.speed.x == 0 && player.speed.y == 0) player.state = "idle";
    if (player.state == "airborne" && currentGravity == 0 && player.speed.y == 0) {
        player.state = "running";
        dashExhausted = false;
    }
    if (player.state == "dash" && dashCounter()) {
        player.state = "airborne";
        dashExhausted = true;
    }

    player.speed.y += currentGravity * delta;
    if (input.up && player.state != "airborne") player.speed.y = -Settings.playerSpeedY;
    if (player.state != "dash") {
        if (input.left) player.speed.x = -Settings.playerSpeedX;
        else if (input.right) player.speed.x = Settings.playerSpeedX;
        else player.speed.x = 0;
    } else {
        player.speed.y = 0;
    }

    if (player.combatState == "human" && shootKeyPress()) {
        const xOffset = flipped ? -8 : Settings.playerBulletSpawnOffsetX;
        spawn({ x: player.x + xOffset, y: player.y + Settings.playerBulletSpawnOffsetY }, { x: flipped ? -1 : 1, y: 0 });
    }
    if (player.combatState == "cow" && dashKeyPress() && !dashExhausted) {
        player.speed.x = flipped ? -Settings.playerDashSpeedX : Settings.playerDashSpeedX;
        player.state = "dash";
    }
    if (morphKeyPress()) player.combatState = player.combatState == "human" ? "cow" : "human";

    player.x += player.speed.x * delta;
    player.y += player.speed.y * delta;

    currentGravity = Settings.gravity;

    track(player);
}

export function collide(translationVector: Vector) {
    if (translationVector.x != 0) {
        player.speed.x = 0
    }
    if (translationVector.y < 0) {
        currentGravity = 0;
    }
    if (translationVector.y != 0) player.speed.y = 0;
}

export function playerDie() {
    player.speed = zero();
    player.x = currentSpawn.x;
    player.y = currentSpawn.y;
}

export function collect() { player.cows++; }