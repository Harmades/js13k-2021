import { Rectangle } from "./rectangle";
import { draw } from "./renderer";
import { Settings } from "./settings";

export const PlatformType = {
    Floor: 0,
    Wall: 1,
    Spikes: 2
};

export type Platform = Rectangle & {
    collision: boolean,
    type: number
}

const floorSprite = {
    x: 0 * Settings.tileSize,
    y: 4 * Settings.tileSize
};
const innerSprite = {
    x: 1 * Settings.tileSize,
    y: 4 * Settings.tileSize
};
const spikesSprite = {
    x: 5 * Settings.tileSize,
    y: 2 * Settings.tileSize
};

export let platforms: Platform[] = [];

export function update(delta: number) {
}

export function render() {
    for (const platform of platforms) {
        const sprite = platform.type == PlatformType.Floor ? floorSprite : platform.type == PlatformType.Wall ? innerSprite : spikesSprite;
        draw(sprite, platform);
    }
}