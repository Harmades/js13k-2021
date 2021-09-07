import { drawPattern } from "./renderer";
import { Settings } from "./settings";

export const lava = {
    x: 0,
    y: Settings.height,
    w: Settings.width,
    h: Settings.height
};

const sprite = {
    x: 3 * Settings.tileSize,
    y: 4 * Settings.tileSize
};

export function update(delta: number) {
    lava.y -= Settings.height * delta / Settings.timer;
}

export function render() {
    drawPattern(sprite, lava);
}