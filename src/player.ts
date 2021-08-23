import { applyGravity } from "./gravity";
import { input } from "./input";
import { Rectangle } from "./rectangle";
import { drawAtlas } from "./renderer";
import { add, multiply, Vector } from "./vector";

export type Player = Rectangle

export const player: Player = {
    x: 20,
    y: 30,
    width: 8,
    height: 8
}

const atlasPosition: Vector = {
    x: 0,
    y: 16
};

export function render() {
    drawAtlas(atlasPosition, player);
}

export function update(delta: number) {
    const translation: Vector = {
        x: 0,
        y: 0
    };
    const speed = 50 * delta;

    if (input.up) translation.y = -1;
    if (input.down) translation.y = 1;
    if (input.left) translation.x = -1;
    if (input.right) translation.x = 1;

    multiply(translation, speed);
    add(player, translation);
    // applyGravity(player);
}