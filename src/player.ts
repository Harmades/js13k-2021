import { createReleasedKeyPress, input } from "./input";
import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
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
    sprite: Vector,
    flipped: boolean,
    span: number
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

const humanIdleSprite = {
    x: 4 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
const humanWalkSprite = {
    x: 0 * Settings.tileSize,
    y: 2 * Settings.tileSize
};
const cowIdleSprite = {
    x: 0 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
const cowWalkSprite = {
    x: 3 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
const cowDashSprite = {
    x: 1 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
let currentGravity = 0;
let dashExhausted = false;
let currentSpawn = { x: Settings.playerSpawnX, y: Settings.playerSpawnY };
const coyoteCounter = createCounter(Settings.playerCoyoteFrames);
const walkCounter = createCounter(Settings.playerWalkCycleFrames);
const dashCounter = createCounter(Settings.playerDashFrames);
const morphKeyPress = createReleasedKeyPress("m");
const shootKeyPress = createReleasedKeyPress("space");
const dashKeyPress = createReleasedKeyPress("shift");
const trails: Player[] = [];
let trailCounter = 0;

export const player: Player = {
    x: Settings.playerSpawnX,
    y: Settings.playerSpawnY,
    w: 15,
    h: Settings.tileSize,
    speed: { x: 0, y: 0 },
    state: PlayerState.Airborne,
    combatState: PlayerCombatState.Human,
    cows: 0,
    sprite: humanIdleSprite,
    flipped: false,
    span: 1
}

export function render() {
    const idleSprite = player.combatState == PlayerCombatState.Human ? humanIdleSprite : cowIdleSprite;
    const walkSprite = player.combatState == PlayerCombatState.Human ? humanWalkSprite : cowWalkSprite;
    player.span = 1;
    if (player.state == PlayerState.Running) {
        if (walkCounter()) {
            player.sprite = player.sprite == idleSprite ? walkSprite : idleSprite;
        }
    }
    if (player.state == PlayerState.Idle || player.state == PlayerState.Airborne || player.state == PlayerState.Coyote) {
        player.sprite = idleSprite;
    }
    if (player.state == PlayerState.Dash) {
        player.sprite = cowDashSprite;
        player.span = 2;
    }
    if (player.speed.x != 0) player.flipped = player.speed.x < 0;
    trailCounter++;
    if (trails.length == 5) trails.shift();
    trails.filter(trail => trail.state == PlayerState.Airborne && player.speed.y < 0 || trail.state == PlayerState.Dash)
        .map((trail, i) => draw(trail.sprite, trail, trail.flipped, trail.span * Settings.tileSize, Settings.tileSize, i / (trails.length - 1)));
    trails.push({ ...player });
    draw(player.sprite, player, player.flipped, player.span * Settings.tileSize, Settings.tileSize);
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
    if (input.up && player.state != PlayerState.Airborne) {
        player.speed.y = -Settings.playerSpeedY;
    }
    if (player.state != PlayerState.Dash) {
        if (input.left) player.speed.x = -Settings.playerSpeedX;
        else if (input.right) player.speed.x = Settings.playerSpeedX;
        else player.speed.x = 0;
    } else {
        player.speed.y = 0;
    }

    if (player.combatState == PlayerCombatState.Human && shootKeyPress()) {
        const xOffset = player.flipped ? -8 : Settings.playerBulletSpawnOffsetX;
        spawn({ x: player.x + xOffset, y: player.y + Settings.playerBulletSpawnOffsetY }, { x: player.flipped ? -1 : 1, y: 0 });
    }
    if (player.combatState == PlayerCombatState.Cow && dashKeyPress() && !dashExhausted) {
        player.speed.x = player.flipped ? -Settings.playerDashSpeedX : Settings.playerDashSpeedX;
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