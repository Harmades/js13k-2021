import { createReleasedKeyPress, input } from "./input";
import { Rectangle } from "./rectangle";
import { draw, drawRect, drawRectOutline, Sprite } from "./renderer";
import { Settings } from "./settings";
import { Vector, zero } from "./vector";
import { spawn } from "./bullet";
import { createCounter, createLinear } from "./animation";
import { shut, track } from "./camera";
import { Tile } from "./tile";
import { attackHit, DynamicTile } from "./dynamicTile";
import { Id } from "../gen/id";
import { abs } from "./alias";
import { gg, notGg } from "./ui";
import { lava } from "./lava";
import { getCollision } from "./physics";
import { Cow } from "./cow";
import * as Songs from "./sounds"
import { startTimer } from "./timer";

export type Player = Rectangle & {
    speed: Vector;
    state: number;
    combatState: number;
    cows: number;
    sprite: Sprite,
    hFlip: boolean,
}

export const PlayerState = {
    Idle: 0,
    Running: 1,
    Coyote: 2,
    Airborne: 3,
    Dash: 4,
    Dead: 5
};

export const PlayerCombatState = {
    Human: 0,
    Cow: 1
}

export const humanIdleSprite = {
    x: 4 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
const humanWalkSprite = {
    x: 5 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
export const cowIdleSprite = {
    x: 0 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
const cowWalkSprite = {
    x: 3 * Settings.tileSize,
    y: 1 * Settings.tileSize
};
export const cowDashSprite = {
    x: 1 * Settings.tileSize,
    y: 1 * Settings.tileSize,
    w: 2 * Settings.tileSize,
    ow: 5
};
const humanHitbox = {
    w: 14,
    h: Settings.tileSize,
    y: 0
};
const cowHitbox = {
    w: Settings.tileSize,
    h: 12,
    y: 4
};
const cowHitboxDashX = 4;

let currentGravity = 0;
let dashExhausted = false;
let currentSpawn: Vector | null = null;
const coyoteCounter = createCounter(Settings.playerCoyoteFrames);
const walkCounter = createCounter(Settings.playerWalkCycleFrames);
const dashAnimationCounter = createCounter(Settings.playerDashAnimationFrames);
const dashCounter = createCounter(Settings.playerDashFrames);
const morphKeyPress = createReleasedKeyPress("shift");
const spaceKeyPress = createReleasedKeyPress("space");
const jumpKeyPress = createReleasedKeyPress("up");
const trails: Player[] = [];
let animation = createLinear(1, 0, 50);
let snapTo: Tile | null = null;
let leftTutorialZone = false;
const tutorialZone = {
    x: 76 * Settings.tileSize,
    y: 86 * Settings.tileSize,
    w: 17 * Settings.tileSize,
    h: 3 * Settings.tileSize
};

export const player: Player = {
    x: Settings.playerSpawnX,
    y: Settings.playerSpawnY,
    w: humanHitbox.w,
    h: humanHitbox.h,
    speed: { x: 0, y: 0 },
    state: PlayerState.Airborne,
    combatState: PlayerCombatState.Human,
    cows: 0,
    sprite: humanIdleSprite,
    hFlip: false,
}

export function render() {
    const idleSprite = player.combatState == PlayerCombatState.Human ? humanIdleSprite : cowIdleSprite;
    const walkSprite = player.combatState == PlayerCombatState.Human ? humanWalkSprite : cowWalkSprite;
    if (player.state == PlayerState.Running) {
        if (walkCounter()) {
            player.sprite = player.sprite == idleSprite ? walkSprite : idleSprite;
        }
    }
    if (player.state == PlayerState.Idle || player.state == PlayerState.Airborne || player.state == PlayerState.Coyote) {
        player.sprite = idleSprite;
    }
    if (player.state == PlayerState.Dead) {
        player.sprite.h = animation() * Settings.tileSize;
    }
    if (trails.length == 5) trails.shift();
    trails.filter(trail => trail.state == PlayerState.Airborne && player.speed.y < 0 || trail.state == PlayerState.Dash)
        .map((trail, i) => draw({ ...trail, ...trail.sprite, alpha: i / (trails.length - 1) }, trail));
    trails.push({ ...player });
    draw({ ...player.sprite, hFlip: player.hFlip }, player);
}

export function update(delta: number) {
    if (player.state == PlayerState.Dead) return;
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
    if (player.state == PlayerState.Dash) {
        if (dashCounter()) {
            player.state = PlayerState.Airborne;
        } else {
            if (dashExhausted || dashAnimationCounter()) {
                player.sprite = cowIdleSprite;
                dashExhausted = true;
                player.w = cowHitbox.w;
            }
            if (!dashExhausted) {
                player.sprite = cowDashSprite;
            }
        }
    }

    if (snapTo != null) {
        player.state = player.speed.x == 0 ? PlayerState.Idle : PlayerState.Running;
        player.y = snapTo.y - player.h;
        if (abs(player.x - snapTo.x) > Settings.tileSize) snapTo = null;
    }
    if (jumpKeyPress() && player.state != PlayerState.Airborne) {
        player.speed.y = -Settings.playerSpeedY;
        snapTo = null;
        Songs.effect_jump();
    } else {
        player.speed.y += currentGravity * delta;
    }
    if (player.state != PlayerState.Dash) {
        if (input.left) player.speed.x = -Settings.playerSpeedX;
        else if (input.right) player.speed.x = Settings.playerSpeedX;
        else player.speed.x = 0;
    } else {
        player.speed.y = 0;
    }
    if (player.speed.x != 0) player.hFlip = player.speed.x < 0;

    if (player.combatState == PlayerCombatState.Human && spaceKeyPress()) {
        const xOffset = player.hFlip ? -8 : Settings.playerBulletSpawnOffsetX;
        spawn({ x: player.x + xOffset, y: player.y + Settings.playerBulletSpawnOffsetY }, { x: player.hFlip ? -1 : 1, y: 0 });
        Songs.effect_shoot();
    }
    if (player.state != PlayerState.Dash && player.combatState == PlayerCombatState.Cow && spaceKeyPress() && !dashExhausted) {
        player.speed.x = player.hFlip ? -Settings.playerDashSpeedX : Settings.playerDashSpeedX;
        player.w += cowHitboxDashX;
        player.state = PlayerState.Dash;
        Songs.effect_dash();
    }
    if (morphKeyPress()) {
        Songs.effect_transform();
        if (player.combatState == PlayerCombatState.Human) {
            player.combatState = PlayerCombatState.Cow;
            player.sprite = cowIdleSprite;
            player.y += cowHitbox.y;
            player.w = cowHitbox.w;
            player.h = cowHitbox.h;
        } else {
            player.combatState = PlayerCombatState.Human;
            player.sprite = humanIdleSprite;
            player.y -= cowHitbox.y;
            player.w = humanHitbox.w;
            player.h = humanHitbox.h;
        }
    }

    player.x += player.speed.x * delta;
    player.y += player.speed.y * delta;

    currentGravity = Settings.gravity;

    track(player);

    if (abs(player.x - Settings.endX) < Settings.tileSize / 2) {
        gg();
    }
    if (player.y + player.h / 2 > lava.y) {
        Songs.stop_song();
        Songs.effect_game_over();
        Songs.play_cowboy();
        notGg();
    }

    if (!leftTutorialZone && getCollision(player, tutorialZone) == null) {
        leftTutorialZone = true;
        startTimer();
    }

    // Do not respawn in tutorial zone
    if (currentSpawn == null && player.y <= 79 * Settings.tileSize) {
        currentSpawn = { x: 106 * Settings.tileSize, y: 77 * Settings.tileSize };
    }
}

export function playerCollide(translationVector: Vector, tile: Tile) {
    if (player.state == PlayerState.Dash && tile.id == Id.cracked_intern_floor_tile) {
        attackHit(tile as DynamicTile);
    } else {
        if (translationVector.x != 0) {
            player.speed.x = 0
        }
        if (translationVector.y < 0) {
            currentGravity = 0;
        }
        if (translationVector.y < 0 && player.speed.y > 0
            || translationVector.y > 0 && player.speed.y < 0) player.speed.y = 0;
    }
    if (tile.id == Id.spikes) playerDie();
}

export function playerDie() {
    if (player.state == PlayerState.Dead) return;
    player.state = PlayerState.Dead;
    animation = createLinear(1, 0, 50);
    player.speed = zero();
    Songs.effect_death();
    shut();
}

export function respawn() {
    player.x = currentSpawn != null ? currentSpawn.x : Settings.playerSpawnX;
    player.y = currentSpawn != null ? currentSpawn.y : Settings.playerSpawnY;
    animation = createLinear(0, 1, 50);
}

export function resurrect() {
    player.sprite.h = Settings.tileSize;
    player.state = PlayerState.Airborne;
}

export function collect(cow: Cow) {
    Songs.effect_mow();
    currentSpawn = { x: cow.x, y: cow.y };
    player.cows++;
}

export function playerSnap(tile: DynamicTile | null, translationVector: Vector) {
    if (tile != null && tile.speed.y > 0 && translationVector.y < 0) snapTo = tile;
    else snapTo = null;
}