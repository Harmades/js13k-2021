import { Rectangle } from "./rectangle";
import { draw } from "./renderer";

export type Cow = Rectangle;

export const cows: Cow[] = [];

export function render() {
    for (const cow of cows) {
        draw("npc_cow.png", cow);
    }
}

export function update(delta: number) {
}