import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
import { Settings } from "./settings";

export type Cow = Rectangle & {
    collected: boolean;
};

export const cows: Cow[] = [];

const sprite = {
    x: 5 * Settings.tileSize,
    y: 0
}

export function render() {
    for (const cow of cows) {
        if (!cow.collected) draw(sprite, cow);
    }
}

export function update(delta: number) {
}

export function disable(cow: Cow) { cow.collected = true; }