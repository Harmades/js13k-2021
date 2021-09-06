import { getTileSprite, tiles } from "./tile";
import { createPatrol, enemies, Enemy, enemyHumanIdleSprite, EnemyState, EnemyType } from "./enemy";
import { zero } from "./vector";
import { floor } from "./alias";
import { cows, cowSprite } from "./cow";
import { Settings } from "./settings";
import { createLinear } from "./animation";
import { level } from "../gen/level";
import { Id } from "../gen/id";

type Data = {
    id: number;
    hFlip: boolean;
    vFlip: boolean;
    dFlip: boolean;
}

export function load() {
    const patrolArray = decompress(level[level.length - 1]);
    for (let l = 0; l < level.length - 1; l++) {
        const layer = level[l];
        const dataArray = decompress(layer);
        for (let i = 0; i < dataArray.length; i++) {
            const data = dataArray[i];
            const worldWidth = Settings.width / Settings.tileSize;
            const worldHeight = Settings.height / Settings.tileSize;
            const x = i % worldWidth;
            const y = floor(i / worldWidth);
            if (isTile(data.id)) {
                const adjacentTiles = getAdjacentTiles(i, dataArray, worldWidth, worldHeight);
                const collision = (data.id == Id.floor_tile || data.id == Id.intern_floor_tile) && adjacentTiles.some(tile => tile.id == Id.bg_tile);
                tiles.push({
                    x: x * Settings.tileSize,
                    y: y * Settings.tileSize,
                    w: Settings.tileSize,
                    h: Settings.tileSize,
                    collision: collision,
                    id: data.id,
                    hFlip: data.hFlip,
                    vFlip: data.vFlip,
                    dFlip: data.dFlip,
                });
            }
            if (isEnemy(data.id)) {
                const [min, max] = getPatrol(i, patrolArray, worldWidth, worldHeight);
                const enemy: Enemy = {
                    x: x * Settings.tileSize,
                    y: y * Settings.tileSize,
                    w: Settings.tileSize,
                    h: Settings.tileSize,
                    hFlip: false,
                    speed: zero(),
                    state: EnemyState.Idle,
                    type: data.id == Id.enenemy_human_butcher ? EnemyType.Human : data.id == Id.ennemy_butcher ? EnemyType.Butcher : EnemyType.Shield,
                    animation: createLinear(1, 0, 50),
                    sprite: { ...enemyHumanIdleSprite },
                    colorized: true
                };
                enemy.patrol = createPatrol(enemy, min * Settings.tileSize, max * Settings.tileSize);
                enemies.push(enemy)
            }
            if (isCow(data.id)) {
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

function getPatrol(index: number, dataArray: Data[], layerWidth: number, layerHeight: number) {
    let min = index % layerWidth;
    let max = index % layerWidth;
    let [left, right] = getAdjacentTilesIndices(index, layerWidth, layerHeight);
    let _ = null;
    while (left != null || right != null) {
        if (left != null) {
            const leftData = dataArray[left];
            if (leftData.id == Id.range_patrol) {
                [left] = getAdjacentTilesIndices(left, layerWidth, layerHeight);
            } else {
                min = (left + 1) % layerWidth;
                left = null;
            }
        }
        if (right != null) {
            const rightData = dataArray[right];
            if (rightData.id == Id.range_patrol) {
                [_, right] = getAdjacentTilesIndices(right, layerWidth, layerHeight);
            } else {
                max = (right - 1) % layerWidth;
                right = null;
            }
        }
    }
    return [min, max];
}

function getAdjacentTilesIndices(index: number, layerWidth: number, layerHeight: number) {
    const column = index % layerWidth;
    const row = floor(index / layerWidth);

    const left = column != 0 ? index - 1 : null;
    const right = column != layerWidth - 1 ? index + 1 : null;
    const up = row != 0 ? (row - 1) * layerWidth + column : null;
    const down = row != layerHeight - 1 ? (row + 1) * layerWidth + column : null;
    return [left, right, up, down];
}

function isTile(id: number) {
    return getTileSprite(id) != null;
}

function isEnemy(id: number) {
    return id == Id.ennemy_butcher || id == Id.enenemy_human_butcher || id == Id.ennemy_shield_butcher;
}

function isCow(id: number) { return id == Id.pnj_cow; }

function decompress(compressed: string): Data[] {
    const result: Data[] = [];
    for (let i = 0; i < compressed.length; i++) {
        if (!isNaN(Number.parseInt(compressed[i]))) continue;
        const id = compressed[i].charCodeAt(0) - 97 - 1;
        const modifier = i != compressed.length - 1 ? compressed[i + 1] : null;
        let modifierValue = modifier != null ? Number.parseInt(modifier) : null;
        let hFlip = false;
        let vFlip = false;
        let dFlip = false;

        if (modifierValue != null && !isNaN(modifierValue)) {
            if ((modifierValue & (1 << 2)) != 0) hFlip = true;
            if ((modifierValue & (1 << 1)) != 0) vFlip = true;
            if ((modifierValue & (1 << 0)) != 0) dFlip = true;
        }
        
        result.push({
            id: id,
            hFlip: hFlip,
            vFlip: vFlip,
            dFlip: dFlip
        });
    }
    return result;
}

function getAdjacentTiles(index: number, data: Data[], layerWidth: number, layerHeight: number) {
    const [left, right, up, down] = getAdjacentTilesIndices(index, layerWidth, layerHeight);
    const tiles = [];
    if (left != null) tiles.push(data[left]);
    if (right != null) tiles.push(data[right]);
    if (up != null) tiles.push(data[up]);
    if (down != null) tiles.push(data[down]);

    return tiles;
}