import { Rectangle } from "./rectangle";
import { draw } from "./renderer";

export type Cow = Rectangle & {
    collected: boolean;
};

export const cows: Cow[] = [];

export function render() {
    for (const cow of cows) {
        if (!cow.collected) draw("npc_cow.png", cow);
    }
}

export function update(delta: number) {
}

export function disable(cow: Cow) { cow.collected = true; }