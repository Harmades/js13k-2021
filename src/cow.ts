import { Rectangle } from "./rectangle";
import { draw, Sprite } from "./renderer";
import { Settings } from "./settings";

export type Cow = Rectangle & {
    collected: boolean;
    animation: () => number;
    sprite: Sprite;
};

export const cowSprite = {
    x: 5 * Settings.tileSize,
    y: 0,
    w: Settings.tileSize,
    h: Settings.tileSize
};

export const cows: Cow[] = [];

export function render() {
    for (const cow of cows) {
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