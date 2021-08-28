import { Rectangle } from "./rectangle";
import { drawPattern } from "./renderer";

export type Platform = Rectangle & {
    collision: boolean,
    inner: boolean
}

const sprite = "floor_tile.png";
const innerSprite = "intern_floor_tile.png";

export let platforms: Platform[] = [];

export function update(delta: number) {
}

export function render() {
    for (const platform of platforms) {
        // const color = platform.collision ? "#FF0000" : "#000000";
        // drawRect(platform, color);
        drawPattern(platform.inner ? innerSprite : sprite, platform);
    }
}