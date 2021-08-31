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
    flipped: boolean;
}

export const EnemyType = {
    Human: 0,
    Butcher: 1,
    Shield: 2
};

export const EnemyState = {
    Idle: 0,
    Running: 1
};

export let enemies: Enemy[] = []

const enemyHumanIdleSprite = "enemy_human_butcher.png";
const enemyHumanWalkSprite = "enemy_human_butcher_walkframe.png";
const enemyButcherIdleSprite = "enemy_butcher.png";
const enemyButcherWalkSprite = "enemy_butcher_walkframe.png";
const enemyShieldIdleSprite = "enemy_shield_butcher.png";
const enemyShieldWalkSprite = "enemy_shield_butcher_walkframe.png";
let currentSprite: Sprite = enemyButcherIdleSprite;
const walkCounter = createCounter(Settings.playerWalkCycleFrames);
const patrols = enemies.map(enemy => createPatrol(enemy));

export function render() {
    for (const enemy of enemies) {
        enemy.flipped = sign(enemy.speed.x) == 1;
        if (enemy.type == EnemyType.Human) {
            if (enemy.state == EnemyState.Idle) currentSprite = enemyHumanIdleSprite;
            if (enemy.state == EnemyState.Running) {
                if (walkCounter()) {
                    currentSprite = currentSprite == enemyHumanIdleSprite ? enemyHumanWalkSprite : enemyHumanIdleSprite;
                }
            }
        }
        if (enemy.type == EnemyType.Butcher) {
            if (enemy.state == EnemyState.Idle) currentSprite = enemyButcherIdleSprite;
            if (enemy.state == EnemyState.Running) {
                if (walkCounter()) {
                    currentSprite = currentSprite == enemyButcherIdleSprite ? enemyButcherWalkSprite : enemyButcherIdleSprite;
                }
            }
        }
        if (enemy.type == EnemyType.Shield) {
            if (enemy.state == EnemyState.Idle) currentSprite = enemyShieldIdleSprite;
            if (enemy.state == EnemyState.Running) {
                if (walkCounter()) {
                    currentSprite = currentSprite == enemyShieldIdleSprite ? enemyShieldWalkSprite : enemyShieldIdleSprite;
                }
            }
        }
        draw(currentSprite, enemy, enemy.flipped);
    }
}

export function update(delta: number) {
    for (let i = 0; i < enemies.length; i++) {
        const patrol = patrols[i];
        // patrol(delta);
    }
}

function die(enemy: Enemy) {
    enemies = enemies.filter(e => e != enemy);
}

export function bulletHit(enemy: Enemy) {
    if (enemy.type != EnemyType.Shield) die(enemy); 
}

export function dashHit(enemy: Enemy) {
    if (enemy.type != EnemyType.Butcher) die(enemy);
    else playerDie();
}

export function enemyCollide(enemy: Enemy) {
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