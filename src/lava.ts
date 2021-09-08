import { drawPattern } from "./renderer";
import { Settings } from "./settings";

export const lava = {
    x: 0,
    y: Settings.height,
    w: Settings.width,
    h: Settings.height
};

const sprite = {
    x: 0 * Settings.tileSize,
    y: 4 * Settings.tileSize
};

const spriteTop = {
    x: 1 * Settings.tileSize,
    y: 4 * Settings.tileSize
};

export function update(delta: number) {
    lava.y -= Settings.height * delta / Settings.timer;
}

export function render() {
    drawPattern(spriteTop, { ...lava, h: Settings.tileSize });
    drawPattern(sprite, { ...lava, y: lava.y + Settings.tileSize });
}