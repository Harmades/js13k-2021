import { Rectangle } from "./rectangle";
import { createCounter } from "./animation";
import Enemy_Butcher from "../asset/characters/enemy_butcher.png";
import Enemy_Butcher_Walkframe from "../asset/characters/enemy_butcher_walkframe.png";
import Enemy_Human from "../asset/characters/enemy_human_butcher.png";
import Enemy_Human_Walkframe from "../asset/characters/enemy_human_butcher.png";
import Enemy_Shield from "../asset/characters/enemy_shield_butcher_walkframe.png";
import Enemy_Shield_Walkframe from "../asset/characters/enemy_shield_butcher_walkframe.png";
import { Settings } from "./settings";
import { drawImage, loadImage } from "./renderer";
import { Vector, zero } from "./vector";
import { sign } from "./math";

export type Enemy = Rectangle & {
    speed: Vector,
    state: EnemyState;
    type: EnemyType;
    patrol: Vector[];
    flipped: boolean;
}

export type EnemyType = "human" | "butcher" | "shield";
export type EnemyState = "idle" | "running";

export const enemies: Enemy[] = [{
    x: 16 * 8,
    y: 16 * 4,
    speed: zero(),
    width: 16,
    height: 16,
    state: "idle",
    type: "human",
    patrol: [{ x: 16 * 8, y: 16 * 4 }, { x: 16 * 10, y: 16 * 4} ],
    flipped: false
}];

const enemyHumanIdleSprite = loadImage(Enemy_Human);
const enemyHumanWalkSprite = loadImage(Enemy_Human_Walkframe);
const enemyButcherIdleSprite = loadImage(Enemy_Butcher);
const enemyButcherWalkSprite = loadImage(Enemy_Butcher_Walkframe);
const enemyShieldIdleSprite = loadImage(Enemy_Shield);
const enemyShieldWalkSprite = loadImage(Enemy_Shield_Walkframe);
let currentSprite = Enemy_Butcher;
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
        drawImage(currentSprite, enemy, enemy.flipped);
    }
}

export function update(delta: number) {
    for (let i = 0; i < enemies.length; i++) {
        const patrol = patrols[i];
        patrol(delta);
    }
}

function createPatrol(enemy: Enemy) {
    let lastPositionIndex = -1;
    return (delta: number) => {
        const targetIndex = (lastPositionIndex + 1) % enemy.patrol.length;
        const target = enemy.patrol[targetIndex];
        if (Math.abs(target.x - enemy.x) <= Settings.epsilon) {
            lastPositionIndex = targetIndex;
        } else {
            const sign = Math.sign(target.x - enemy.x);
            enemy.speed.x = sign * Settings.enemySpeedX;
            enemy.x += enemy.speed.x * delta;
        }
    };
}