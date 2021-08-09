import { player } from "./player";
import { collides, Rectangle } from "./rectangle";
import { drawRect } from "./renderer";

export type Platform = Rectangle & {
    collision: boolean
}

export const platforms: Platform[] = [{
    x: 100,
    y: 50,
    width: 50,
    height: 50,
    collision: false
}];

export function update(delta: number) {
    for (const platform of platforms) {
        platform.collision = collides(player, platform);
    }
}

export function render() {
    for (const platform of platforms) {
        const color = platform.collision ? "#FF0000" : "#000000";
        drawRect(platform, color);
    }
}