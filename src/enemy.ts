import { Rectangle } from "./rectangle";
import { createCounter } from "./animation";
import { Settings } from "./settings";
import { Vector } from "./vector";
import { abs, sign } from "./alias";
import { draw, Sprite } from "./renderer";
import { player, playerDie } from "./player";

export type Enemy = Rectangle & {
    speed: Vector,
    state: EnemyState;
    type: EnemyType;
    patrol: Vector[];
    flipped: boolean;
}

export type EnemyType = "human" | "butcher" | "shield";
export type EnemyState = "idle" | "running";

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
        if (enemy.type == "human") {
            if (enemy.state == "idle") currentSprite = enemyHumanIdleSprite;
            if (enemy.state == "running") {
                if (walkCounter()) {
                    currentSprite = currentSprite == enemyHumanIdleSprite ? enemyHumanWalkSprite : enemyHumanIdleSprite;
                }
            }
        }
        if (enemy.type == "butcher") {
            if (enemy.state == "idle") currentSprite = enemyButcherIdleSprite;
            if (enemy.state == "running") {
                if (walkCounter()) {
                    currentSprite = currentSprite == enemyButcherIdleSprite ? enemyButcherWalkSprite : enemyButcherIdleSprite;
                }
            }
        }
        if (enemy.type == "shield") {
            if (enemy.state == "idle") currentSprite = enemyShieldIdleSprite;
            if (enemy.state == "running") {
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
    if (enemy.type != "shield") die(enemy); 
}

export function dashHit(enemy: Enemy) {
    if (enemy.type != "butcher") die(enemy);
    else playerDie();
}

export function enemyCollide(enemy: Enemy) {
    if (player.state == "dash") dashHit(enemy);
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