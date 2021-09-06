import { Id } from "../gen/id";
import { Rectangle } from "./rectangle";
import { draw, Sprite } from "./renderer";
import { Settings } from "./settings";

export type Tile = Rectangle & {
    collision: boolean,
    id: number,
    hFlip: boolean,
    vFlip: boolean,
    dFlip: boolean,
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
    y: 4 * Settings.tileSize
};
const knivesSprite = {
    x: 2 * Settings.tileSize,
    y: 4 * Settings.tileSize
};
const apronsSprite = {
    x: 0 * Settings.tileSize,
    y: 0 * Settings.tileSize
};
const blood1Sprite = {
    x: 2 * Settings.tileSize,
    y: 0 * Settings.tileSize
};
const blood2Sprite = {
    x: 3 * Settings.tileSize,
    y: 0 * Settings.tileSize
};
const steakSprite = {
    x: 2 * Settings.tileSize,
    y: 5 * Settings.tileSize
};
const bgTileSprite = {
    x: 1 * Settings.tileSize,
    y: 0 * Settings.tileSize
};
const windowSprite = {
    x: 4 * Settings.tileSize,
    y: 5 * Settings.tileSize
};
const windowCornerSprite = {
    x: 3 * Settings.tileSize,
    y: 5 * Settings.tileSize
};


export let tiles: Tile[] = [];

export function update(delta: number) { }

export function render() {
    for (const tile of tiles) {
        const sprite = getTileSprite(tile.id);
        if (sprite != null) draw({ ...tile, ...sprite }, tile);
    }
}

export function getTileSprite(id: number): Sprite | null { 
    if (id == Id.bg_tile) return bgTileSprite;
    if (id == Id.floor_tile) return floorSprite;
    if (id == Id.intern_floor_tile) return innerSprite;
    if (id == Id.spikes) return spikesSprite;
    if (id == Id.knifes) return knivesSprite;
    if (id == Id.aprons) return apronsSprite;
    if (id == Id.blood1) return blood1Sprite;
    if (id == Id.blood2) return blood2Sprite;
    if (id == Id.steak) return steakSprite;
    if (id == Id.window_corner) return windowCornerSprite;
    if (id == Id.window_side) return windowSprite;
    return null;
}
