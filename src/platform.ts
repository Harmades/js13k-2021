import { Rectangle } from "./rectangle";
import { drawPattern } from "./renderer";

export type Platform = Rectangle & {
    collision: boolean
}

const sprite = "floor_tile.png";

export const platforms: Platform[] = [
    {
        x: 16,
        y: 96,
        width: 16 * 3,
        height: 16,
        collision: false
    },
    {
        x: 96,
        y: 80,
        width: 16 * 5,
        height: 16,
        collision: false
    }];

export function update(delta: number) {
}

export function render() {
    for (const platform of platforms) {
        // const color = platform.collision ? "#FF0000" : "#000000";
        // drawRect(platform, color);
        drawPattern(sprite, platform);
    }
}