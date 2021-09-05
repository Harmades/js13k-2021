import { getTileSprite, tiles } from "./tile";
import { enemies, enemyHumanIdleSprite, EnemyState, EnemyType } from "./enemy";
import { zero } from "./vector";
import { floor } from "./alias";
import { cows, cowSprite } from "./cow";
import { Settings } from "./settings";
import { createLinear } from "./animation";
import { level } from "../gen/level";
import { Id } from "../gen/id";

export function load() {
    for (const layer of level) {
        const data = decompress(layer);
        for (let i = 0; i < data.length; i++) {
            const id = data[i] % Math.pow(2, 31) - 1;
            const worldWidth = Settings.width / Settings.tileSize;
            const worldHeight = Settings.height / Settings.tileSize;
            const x = i % worldWidth;
            const y = floor(i / worldWidth);
            if (isTile(id)) {
                const adjacentTiles = getAdjacentTiles(i, data, worldWidth, worldHeight);
                const collision = (id == Id.floor_tile || id == Id.intern_floor_tile) && adjacentTiles.some(tileId => tileId == 1);
                tiles.push({
                    x: x * Settings.tileSize,
                    y: y * Settings.tileSize,
                    w: Settings.tileSize,
                    h: Settings.tileSize,
                    collision: collision,
                    id: id
                });
            }
            if (isEnemy(id)) {
                enemies.push({
                    x: x * Settings.tileSize,
                    y: y * Settings.tileSize,
                    w: Settings.tileSize,
                    h: Settings.tileSize,
                    flip: false,
                    patrol: [],
                    speed: zero(),
                    state: EnemyState.Idle,
                    type: id == Id.ennemy_human_butcher ? EnemyType.Human : id == Id.ennemy_butcher ? EnemyType.Butcher : EnemyType.Shield,
                    animation: createLinear(1, 0, 50),
                    sprite: { ...enemyHumanIdleSprite },
                    colorized: true
                })
            }
            if (isCow(id)) {
                cows.push({
                    x: x * Settings.tileSize,
                    y: y * Settings.tileSize,
                    w: Settings.tileSize,
                    h: Settings.tileSize,
                    collected: false,
                    animation: createLinear(1, 0, 50),
                    sprite: { ...cowSprite }
                })
            }
        }
    }

}

function isTile(id: number) {
    return getTileSprite(id) != null;
}

function isEnemy(id: number) {
    return id == Id.ennemy_butcher || id == Id.ennemy_human_butcher || id == Id.ennemy_shield_butcher;
}

function isCow(id: number) { return id == Id.pnj_cow; }

function decompress(compressed: string): number[] {
    const result = [];
    for (const char of compressed) {
        result.push(char.charCodeAt(0) - 97);
    }
    return result;
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