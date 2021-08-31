import { Rectangle } from "./rectangle";
import { draw } from "./renderer";

export const PlatformType = {
    Floor: 0,
    Wall: 1,
    Spikes: 2
};

export type Platform = Rectangle & {
    collision: boolean,
    type: number
}

const floorSprite = "floor_tile.png";
const innerSprite = "intern_floor_tile.png";
const spikesSprite = "spikes.png"

export let platforms: Platform[] = [];

export function update(delta: number) {
}

export function render() {
    for (const platform of platforms) {
        const sprite = platform.type == PlatformType.Floor ? floorSprite : platform.type == PlatformType.Wall ? innerSprite : spikesSprite;
        draw(sprite, platform);
    }
}