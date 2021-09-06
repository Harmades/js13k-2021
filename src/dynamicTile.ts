import { abs, sign } from "./alias";
import { draw } from "./renderer";
import { Settings } from "./settings";
import { Tile } from "./tile";

export type DynamicTile = Tile & {
    patrol?: (delta: number) => void;
    breakable: boolean;
    broken: boolean
}

export const movingTiles: DynamicTile[] = [];

const movingPlatformSprite = {
    x: 4 * Settings.tileSize,
    y: 4 * Settings.tileSize
};
const crackedSprite = {
    x: 2 * Settings.tileSize,
    y: 2 * Settings.tileSize
};

export function update(delta: number) {
    for (const tile of movingTiles) {
        if (tile.patrol) tile.patrol(delta);
    }
}

export function render() {
    for (const tile of movingTiles) {
        if (tile.broken) continue;
        const sprite = tile.breakable ? crackedSprite : movingPlatformSprite;
        draw({ ...tile, ...sprite }, tile);
    }
}

export function createTilePatrol(tile: Tile, min: number, max: number) {
    let target = -1;
    return (delta: number) => {
        if (abs(max - tile.y) <= Settings.epsilon) {
            target = min;
        }
        if (abs(min - tile.y) <= Settings.epsilon) {
            target = max;
        }
        const s = sign(target - tile.y);
        tile.y += s * Settings.tileSpeedY * delta;
    };
}

export function attackHit(tile: DynamicTile) {
    if (!tile.broken && tile.breakable) {
        tile.broken = true;
        tile.collision = false;
    }
}