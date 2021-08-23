import { Rectangle } from "./rectangle";
import { drawRect } from "./renderer";

export type Platform = Rectangle & {
    collision: boolean
}

export const platforms: Platform[] = [
    {
        x: 20,
        y: 100,
        width: 50,
        height: 20,
        collision: false
    },
    {
        x: 100,
        y: 50,
        width: 50,
        height: 50,
        collision: false
    }];

export function update(delta: number) {
}

export function render() {
    for (const platform of platforms) {
        const color = platform.collision ? "#FF0000" : "#000000";
        drawRect(platform, color);
    }
}