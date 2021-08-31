import Level from "../asset/lvl_test.json";
import { platforms, PlatformType } from "./platform";
import { enemies, EnemyState, EnemyType } from "./enemy";
import { zero } from "./vector";
import { floor } from "./alias";
import { cows } from "./cow";

export function load() {
    const layer = Level.layers[1];
    const data = layer.data;
    for (let i = 0; i < data.length; i++) {
        const id = data[i] % Math.pow(2, 31);
        const x = i % layer.width;
        const y = floor(i / layer.width);
        if (id == 18 || id == 19 || id == 20) {
            const adjacentTiles = getAdjacentTiles(i, data, layer.width, layer.height);
            const collision = adjacentTiles.some(tileId => tileId == 0);
            platforms.push({
                x: x * 16,
                y: y * 16,
                w: 16,
                h: 16,
                collision: collision,
                type: id == 18 ? PlatformType.Floor : id == 19 ? PlatformType.Wall : PlatformType.Spikes
            });
        }
        if (id == 7 || id == 8 || id == 9) {
            enemies.push({
                x: x * 16,
                y: y * 16,
                w: 16,
                h: 16,
                flipped: false,
                patrol: [],
                speed: zero(),
                state: EnemyState.Idle,
                type: id == 7 ? EnemyType.Human : id == 8 ? EnemyType.Butcher : EnemyType.Shield
            })
        }
        if (id == 10) {
            cows.push({
                x: x * 16,
                y: y * 16,
                w: 16,
                h: 16,
                collected: false
            })
        }
    }
}

function getAdjacentTiles(index: number, data: number[], layerWidth: number, layerHeight: number) {
    const column = index % layerWidth;
    const row = floor(index / layerWidth);

    const left = column != 0 ? index - 1 : null;
    const right = column != layerWidth - 1 ? index + 1 : null;
    const up = row != 0 ? (row - 1) * layerWidth + column : null;
    const down = row != layerHeight - 1 ? (row + 1) * layerWidth + column : null;

    const tiles = [];
    if (left != null) tiles.push(data[left]);
    if (right != null) tiles.push(data[right]);
    if (up != null) tiles.push(data[up]);
    if (down != null) tiles.push(data[down]);

    return tiles;
}