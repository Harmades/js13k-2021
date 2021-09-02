import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
import { Settings } from "./settings";

export type Cow = Rectangle & {
    collected: boolean;
    animation: () => number;
};

export const cows: Cow[] = [];

const sprite = {
    x: 5 * Settings.tileSize,
    y: 0,
    w: Settings.tileSize,
    h: Settings.tileSize
}

export function render() {
    for (const cow of cows) {
        let height = Settings.tileSize;
        let y = cow.y;
        if (cow.collected) {
            const current = cow.animation();
            height = current * 16;
            y += (current - 1) * 2;
        }
        cow.y = y;
        cow.h = height;
        draw(sprite, cow);
    }
}

export function update(delta: number) {
}

export function disable(cow: Cow) { cow.collected = true; }