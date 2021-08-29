import { floor } from "./alias";
import { draw, drawPattern } from "./renderer";
import { Settings } from "./settings";

const emptySprite = "nostars.png";
const stars1Sprite = "stars1.png";
const stars2Sprite = "stars2.png";

export function render() {
    drawPattern(emptySprite, { x: 0, y: 0, w: Settings.width, h: Settings.height });
    const maxTile = 119 * 85 - 1;
    for (let i = 0; i < maxTile; i++) {
        const x = i % 119;
        const y = floor(i / 119);
        const sprite = i % 2 > 0 ? emptySprite : stars2Sprite;
        draw(sprite, { x: x * 16, y: y * 16});
    }
}