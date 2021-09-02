import { Rectangle } from "./rectangle";
import { createCounter } from "./animation";
import { Settings } from "./settings";
import { Vector } from "./vector";
import { abs, sign } from "./alias";
import { draw, Sprite } from "./renderer";
import { player, playerDie, PlayerState } from "./player";

export type Enemy = Rectangle & {
    speed: Vector,
    state: number;
    type: number;
    patrol: Vector[];
    flip: boolean;
    animation: () => number;
    sprite: Sprite;
    colorized: boolean;
}

export const EnemyType = {
    Human: 0,
    Butcher: 1,
    Shield: 2
};

export const EnemyState = {
    Idle: 0,
    Running: 1,
    Dead: 2
};

export let enemies: Enemy[] = []

export const enemyHumanIdleSprite = {
    x: 4 * Settings.tileSize,
    y: 2 * Settings.tileSize
};
const enemyHumanWalkSprite = {
    x: 0 * Settings.tileSize,
    y: 3 * Settings.tileSize
};
const enemyButcherIdleSprite = {
    x: 1 * Settings.tileSize,
    y: 3 * Settings.tileSize
};
const enemyButcherWalkSprite = {
    x: 2 * Settings.tileSize,
    y: 3 * Settings.tileSize
};
const enemyShieldIdleSprite = {
    x: 3 * Settings.tileSize,
    y: 3 * Settings.tileSize
};
const enemyShieldWalkSprite = {
    x: 4 * Settings.tileSize,
    y: 3 * Settings.tileSize
};

const walkCounter = createCounter(Settings.playerWalkCycleFrames);
const patrols = enemies.map(enemy => createPatrol(enemy));

export function render() {
    for (const enemy of enemies) {
        enemy.flip = sign(enemy.speed.x) == 1;
        enemy.sprite = getSprite(enemy);
        if (enemy.state == EnemyState.Dead) {
            const current = enemy.animation();
            enemy.sprite.h = current * 16;
            enemy.y -= (current - 1) * 2;
        }
        draw({ ...enemy, ...enemy.sprite }, enemy);
    }
}

function getSprite(enemy: Enemy) {
    let sprite = enemy.sprite;
    if (enemy.type == EnemyType.Human) {
        if (enemy.state == EnemyState.Idle) sprite = enemyHumanIdleSprite;
        if (enemy.state == EnemyState.Running) {
            if (walkCounter()) {
                sprite = sprite == enemyHumanIdleSprite ? enemyHumanWalkSprite : enemyHumanIdleSprite;
            }
        }
    }
    if (enemy.type == EnemyType.Butcher) {
        if (enemy.state == EnemyState.Idle) sprite = enemyButcherIdleSprite;
        if (enemy.state == EnemyState.Running) {
            if (walkCounter()) {
                sprite = sprite == enemyButcherIdleSprite ? enemyButcherWalkSprite : enemyButcherIdleSprite;
            }
        }
    }
    if (enemy.type == EnemyType.Shield) {
        if (enemy.state == EnemyState.Idle) sprite = enemyShieldIdleSprite;
        if (enemy.state == EnemyState.Running) {
            if (walkCounter()) {
                sprite = sprite == enemyShieldIdleSprite ? enemyShieldWalkSprite : enemyShieldIdleSprite;
            }
        }
    }
    return { ...sprite };
}

export function update(delta: number) {
    for (let i = 0; i < enemies.length; i++) {
        const patrol = patrols[i];
        // patrol(delta);
    }
}

function die(enemy: Enemy) {
    enemy.state = EnemyState.Dead;
    enemy.colorized = false;
}

export function bulletHit(enemy: Enemy) {
    if (enemy.type != EnemyType.Shield) die(enemy); 
}

export function dashHit(enemy: Enemy) {
    if (enemy.type != EnemyType.Butcher) die(enemy);
    else playerDie();
}

export function enemyCollide(enemy: Enemy) {
    if (enemy.state == EnemyState.Dead) return;
    if (player.state == PlayerState.Dash) dashHit(enemy);
    else playerDie();
}

function createPatrol(enemy: Enemy) {
    let lastPositionIndex = -1;
    return (delta: number) => {
        const targetIndex = (lastPositionIndex + 1) % enemy.patrol.length;
        const target = enemy.patrol[targetIndex];
        if (abs(target.x - enemy.x) <= Settings.epsilon) {
            lastPositionIndex = targetIndex;
        } else {
            const s = sign(target.x - enemy.x);
            enemy.speed.x = s * Settings.enemySpeedX;
            enemy.x += enemy.speed.x * delta;
        }
    };
}