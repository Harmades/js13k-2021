import { Rectangle } from "./rectangle";
import { draw } from "./renderer";

export type PlatformType = "floor" | "wall" | "spikes";

export type Platform = Rectangle & {
    collision: boolean,
    type: PlatformType
}

const floorSprite = "floor_tile.png";
const innerSprite = "intern_floor_tile.png";
const spikesSprite = "spikes.png"

export let platforms: Platform[] = [];

export function update(delta: number) {
}

export function render() {
    for (const platform of platforms) {
        const sprite = platform.type == "floor" ? floorSprite : platform.type == "wall" ? innerSprite : spikesSprite;
        draw(sprite, platform);
    }
}