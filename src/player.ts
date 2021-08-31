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
    state: number;
    combatState: number;
    cows: number;
}

export const PlayerState = {
    Idle: 0,
    Running: 1,
    Coyote: 2,
    Airborne: 3,
    Dash: 4
};

export const PlayerCombatState = {
    Human: 0,
    Cow: 1
}

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
    state: PlayerState.Airborne,
    combatState: PlayerCombatState.Human,
    cows: 0
}

export function render() {
    const idleSprite = player.combatState == PlayerCombatState.Human ? humanIdleSprite : cowIdleSprite;
    const walkSprite = player.combatState == PlayerCombatState.Human ? humanWalkSprite : cowWalkSprite;
    if (player.state == PlayerState.Running) {
        if (walkCounter()) {
            currentSprite = currentSprite == idleSprite ? walkSprite : idleSprite;
        }
    }
    if (player.state == PlayerState.Idle || player.state == PlayerState.Airborne || player.state == PlayerState.Coyote) {
        currentSprite = idleSprite;
    }
    if (player.state == PlayerState.Dash) {
        currentSprite = cowDashSprite;
    }
    if (player.speed.x != 0) flipped = player.speed.x < 0;
    draw(currentSprite, player, flipped);
}

export function update(delta: number) {
    if (player.state == PlayerState.Idle && player.speed.x != 0) player.state = PlayerState.Running;
    if (player.state == PlayerState.Idle && player.speed.y != 0) player.state = PlayerState.Airborne;
    if (player.state == PlayerState.Running && player.speed.y > 0) player.state = PlayerState.Coyote;
    if (player.state == PlayerState.Running && player.speed.y < 0) player.state = PlayerState.Airborne;
    if (player.state == PlayerState.Coyote && player.speed.y < 0) player.state = PlayerState.Airborne;
    if (player.state == PlayerState.Coyote && player.speed.y > 0) {
        if (coyoteCounter()) {
            player.state = PlayerState.Airborne;
        }
    }
    if (player.state == PlayerState.Running && player.speed.x == 0 && player.speed.y == 0) player.state = PlayerState.Idle;
    if (player.state == PlayerState.Airborne && currentGravity == 0 && player.speed.y == 0) {
        player.state = PlayerState.Running;
        dashExhausted = false;
    }
    if (player.state == PlayerState.Dash && dashCounter()) {
        player.state = PlayerState.Airborne;
        dashExhausted = true;
    }

    player.speed.y += currentGravity * delta;
    if (input.up && player.state != PlayerState.Airborne) player.speed.y = -Settings.playerSpeedY;
    if (player.state != PlayerState.Dash) {
        if (input.left) player.speed.x = -Settings.playerSpeedX;
        else if (input.right) player.speed.x = Settings.playerSpeedX;
        else player.speed.x = 0;
    } else {
        player.speed.y = 0;
    }

    if (player.combatState == PlayerCombatState.Human && shootKeyPress()) {
        const xOffset = flipped ? -8 : Settings.playerBulletSpawnOffsetX;
        spawn({ x: player.x + xOffset, y: player.y + Settings.playerBulletSpawnOffsetY }, { x: flipped ? -1 : 1, y: 0 });
    }
    if (player.combatState == PlayerCombatState.Cow && dashKeyPress() && !dashExhausted) {
        player.speed.x = flipped ? -Settings.playerDashSpeedX : Settings.playerDashSpeedX;
        player.state = PlayerState.Dash;
    }
    if (morphKeyPress()) player.combatState = player.combatState == PlayerCombatState.Human ? PlayerCombatState.Cow : PlayerCombatState.Human;

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