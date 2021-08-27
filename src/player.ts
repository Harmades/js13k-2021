import { Input, input } from "./input";
import { Rectangle } from "./rectangle";
import { drawImage, loadImage } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";
import { spawn } from "./bullets";
import Charac_Cowboy from "../asset/characters/charac_cowboy.png";
import Charac_Cowboy_Walkframe from "../asset/characters/charac_cowboy_walkframe.png";
import Charac_Cow from "../asset/characters/charac_cow.png";
import Charac_Cow_Walkframe from "../asset/characters/charac_cow_walkframe.png";
import Charac_Cow_Dashframe from "../asset/characters/charac_cow_dashframe.png";

export type Player = Rectangle & {
    speed: Vector;
    state: PlayerState;
    combatState: PlayerCombatState;
}

export type PlayerState = "idle" | "running" | "coyote" | "airborne" | "dash"
export type PlayerCombatState = "human" | "cow"

const humanIdleSprite = loadImage(Charac_Cowboy);
const humanWalkSprite = loadImage(Charac_Cowboy_Walkframe);
const cowIdleSprite = loadImage(Charac_Cow);
const cowWalkSprite = loadImage(Charac_Cow_Walkframe);
const cowDashSprite = loadImage(Charac_Cow_Dashframe);
let currentSprite = humanIdleSprite;

let currentGravity = 0;
let flipped = false;
let dashExhausted = false;
const coyoteCounter = createCounter(Settings.playerCoyoteFrames);
const walkCounter = createCounter(Settings.playerWalkCycleFrames);
const dashCounter = createCounter(Settings.playerDashFrames);
const morphKeyPress = createReleasedKeyPress("m");
const shootKeyPress = createReleasedKeyPress("space");
const dashKeyPress = createReleasedKeyPress("shift");

export const player: Player = {
    x: 20,
    y: 30,
    width: 15,
    height: 16,
    speed: { x: 0, y: 0 },
    state: "airborne",
    combatState: "human"
}

export function render() {
    const idleSprite = player.combatState == "human" ? humanIdleSprite : cowIdleSprite;
    const walkSprite = player.combatState == "human" ? humanWalkSprite : cowWalkSprite;
    if (player.state == "running") {
        if (walkCounter()) {
            currentSprite = currentSprite == idleSprite ? walkSprite : idleSprite;
        }
        flipped = player.speed.x < 0;
    }
    if (player.state == "idle" || player.state == "airborne" || player.state == "coyote") {
        currentSprite = idleSprite;
    }
    if (player.state == "dash") {
        currentSprite = cowDashSprite;
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

function createReleasedKeyPress(key: keyof Input) {
    let released = true;
    return () => {
        if (input[key] && released) {
            released = false;
            return true;
        }
        if (!input[key]) released = true;
        return false;
    };
}

function createCounter(threshold: number) {
    let counter = 0;
    return () => {
        if (counter == threshold) {
            counter = 0;
            return true;
        } else {
            counter++;
            return false;
        }
    };
}