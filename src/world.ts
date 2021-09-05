import { getTileSprite, tiles } from "./tile";
import { enemies, enemyHumanIdleSprite, EnemyState, EnemyType } from "./enemy";
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
    for (const layer of level) {
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
                enemies.push({
                    x: x * Settings.tileSize,
                    y: y * Settings.tileSize,
                    w: Settings.tileSize,
                    h: Settings.tileSize,
                    flip: false,
                    patrol: [],
                    speed: zero(),
                    state: EnemyState.Idle,
                    type: data.id == Id.enenemy_human_butcher ? EnemyType.Human : data.id == Id.ennemy_butcher ? EnemyType.Butcher : EnemyType.Shield,
                    animation: createLinear(1, 0, 50),
                    sprite: { ...enemyHumanIdleSprite },
                    colorized: true
                })
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