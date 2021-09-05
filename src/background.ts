import { floor } from "./alias";
import { draw, drawPattern } from "./renderer";
import { Settings } from "./settings";

const emptySprite = {
    x: 5 * Settings.tileSize,
    y: 0 * Settings.tileSize
};

const stars1Sprite = {
    x: 1 * Settings.tileSize,
    y: 5 * Settings.tileSize
};

const stars2Sprite = {
    x: 0 * Settings.tileSize,
    y: 5 * Settings.tileSize
};

export function render() {
    drawPattern(emptySprite, { x: 0, y: 0, w: Settings.width, h: Settings.height });
    const maxTile = 119 * 85 - 1;
    for (let i = 0; i < maxTile; i++) {
        const x = i % 119;
        const y = floor(i / 119);
        const sprite = i % 2 > 0 ? emptySprite : stars2Sprite;
        draw(sprite, { x: x * Settings.tileSize, y: y * Settings.tileSize});
    }
}