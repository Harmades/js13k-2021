import { Rectangle } from "./rectangle";
import { createCounter } from "./animation";
import { Settings } from "./settings";
import { Vector } from "./vector";
import { abs, sign } from "./alias";
import { draw, Sprite, spriteEquals } from "./renderer";
import { player, playerDie, PlayerState } from "./player";
import { Id } from "../gen/id";

export type Enemy = Rectangle & {
    speed: Vector,
    state: number;
    id: number;
    patrol?: (delta: number) => void;
    hFlip: boolean;
    animation: () => number;
    sprite: Sprite;
    colorized: boolean;
}

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
    x: 2 * Settings.tileSize,
    y: 3 * Settings.tileSize
};
const enemyButcherIdleSprite = {
    x: 0 * Settings.tileSize,
    y: 3 * Settings.tileSize
};
const enemyButcherWalkSprite = {
    x: 1 * Settings.tileSize,
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

const walkCounter = createCounter(Settings.enemyWalkCycleFrames);

export function render() {
    for (const enemy of enemies) {
        enemy.hFlip = sign(enemy.speed.x) == 1;
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
    if (enemy.id == Id.enenemy_human_butcher) {
        if (enemy.state == EnemyState.Idle) sprite = enemyHumanIdleSprite;
        if (enemy.state == EnemyState.Running) {
            if (walkCounter()) {
                sprite = spriteEquals(sprite, enemyHumanIdleSprite) ? enemyHumanWalkSprite : enemyHumanIdleSprite;
            }
        }
    }
    if (enemy.id == Id.ennemy_butcher) {
        if (enemy.state == EnemyState.Idle) sprite = enemyButcherIdleSprite;
        if (enemy.state == EnemyState.Running) {
            if (walkCounter()) {
                sprite = spriteEquals(sprite, enemyButcherIdleSprite) ? enemyButcherWalkSprite : enemyButcherIdleSprite;
            }
        }
    }
    if (enemy.id == Id.ennemy_shield_butcher) {
        if (enemy.state == EnemyState.Idle) sprite = enemyShieldIdleSprite;
        if (enemy.state == EnemyState.Running) {
            if (walkCounter()) {
                sprite = spriteEquals(sprite, enemyShieldIdleSprite) ? enemyShieldWalkSprite : enemyShieldIdleSprite;
            }
        }
    }
    return { ...sprite };
}

export function update(delta: number) {
    for (const enemy of enemies) {
        if (enemy.state == EnemyState.Dead) continue;
        if (enemy.patrol) enemy.patrol(delta);
        if (enemy.speed.x != 0) enemy.state = EnemyState.Running;
        enemy.x += enemy.speed.x * delta;
    }
}

function die(enemy: Enemy) {
    enemy.state = EnemyState.Dead;
    enemy.colorized = false;
}

export function bulletHit(enemy: Enemy) {
    if (enemy.id != Id.ennemy_shield_butcher) die(enemy); 
}

export function dashHit(enemy: Enemy) {
    if (enemy.id != Id.ennemy_butcher) die(enemy);
    else playerDie();
}

export function enemyCollide(enemy: Enemy) {
    if (enemy.state == EnemyState.Dead) return;
    if (player.state == PlayerState.Dash) dashHit(enemy);
    else playerDie();
}

export function createPatrol(enemy: Enemy, min: number, max: number) {
    let target = -1;
    return (delta: number) => {
        if (abs(max - enemy.x) <= Settings.epsilon) {
            target = min;
        }
        if (abs(min - enemy.x) <= Settings.epsilon) {
            target = max;
        }
        const s = sign(target - enemy.x);
        enemy.speed.x = s * Settings.enemySpeedX;
    };
}