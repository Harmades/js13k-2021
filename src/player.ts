import { drawAtlas } from "./renderer";
import { Vector } from "./vector";

export type Player = Vector

export const player: Player = {
    x: 20,
    y: 30
}

const atlasPosition: Vector = {
    x: 0,
    y: 16
};

export function render() {
    drawAtlas(atlasPosition, player);
}