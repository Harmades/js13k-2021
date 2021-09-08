import { lava } from "./lava";
import { Rectangle } from "./rectangle";
import { draw, Sprite } from "./renderer";
import { Settings } from "./settings";

export type Cow = Rectangle & {
    collected: boolean;
    dead: boolean;
    animation: () => number;
    sprite: Sprite;
};

export const cowSprite = {
    x: 4 * Settings.tileSize,
    y: 4 * Settings.tileSize,
    w: Settings.tileSize,
    h: Settings.tileSize
};

export const cows: Cow[] = [];

export function render() {
    for (const cow of cows) {
        if (cow.y >= lava.y) cow.dead = true;
        if (cow.collected) {
            const current = cow.animation();
            cow.sprite.h = current * 16;
            cow.y += (current - 1) * 2;
        }
        draw(cow.sprite, cow);
    }
}

export function update(delta: number) {
}

export function disable(cow: Cow) { cow.collected = true; }