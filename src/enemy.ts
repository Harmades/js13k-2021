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

export type Enemy = Rectangle & {
    state: EnemyState;
    type: EnemyType;
}

export type EnemyType = "human" | "butcher" | "shield";
export type EnemyState = "idle" | "running";

export const enemies: Enemy[] = [{
    x: 16 * 8,
    y: 16 * 4,
    width: 16,
    height: 16,
    state: "idle",
    type: "human"
}];

const enemyHumanIdleSprite = loadImage(Enemy_Human);
const enemyHumanWalkSprite = loadImage(Enemy_Human_Walkframe);
const enemyButcherIdleSprite = loadImage(Enemy_Butcher);
const enemyButcherWalkSprite = loadImage(Enemy_Butcher_Walkframe);
const enemyShieldIdleSprite = loadImage(Enemy_Shield);
const enemyShieldWalkSprite = loadImage(Enemy_Shield_Walkframe);
let currentSprite = Enemy_Butcher;
const walkCounter = createCounter(Settings.playerWalkCycleFrames);

export function render() {
    for (const enemy of enemies) {
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
        drawImage(currentSprite, enemy);
    }
}

export function update(delta: number) {

}