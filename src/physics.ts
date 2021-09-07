import { bulletCollide, bullets } from "./bullet";
import { cows, disable } from "./cow";
import { bulletHit, enemies, enemyCollide } from "./enemy";
import { abs, sign } from "./alias";
import { tiles } from "./tile";
import { collect, player, playerCollide, playerSnap } from "./player";
import { getCenter, Rectangle } from "./rectangle";
import { Settings } from "./settings";
import { add, Vector } from "./vector";
import { attackHit, DynamicTile, movingTiles } from "./dynamicTile";
import { Id } from "../gen/id";

export type Collision = Rectangle;

type Overlap = Vector

export function getCollision(rectangle1: Rectangle, rectangle2: Rectangle): Collision | null {
    const xOverlap = getOverlap(xProject(rectangle1), xProject(rectangle2));
    const yOverlap = getOverlap(yProject(rectangle1), yProject(rectangle2));
    // collides if there is an overlap on x axis and y axis
    if (xOverlap == null || yOverlap == null) return null;
    return {
        x: xOverlap.x,
        y: yOverlap.x,
        w: xOverlap.y - xOverlap.x,
        h: yOverlap.y - yOverlap.x
    };
}

export function update(delta: number) {
    for (const tile of getEntitiesNearEntity(player, [...tiles, ...movingTiles])) {
        if (!tile.collision) continue;
        const collision = getCollision(player, tile)
        if (collision != null) {
            const translationVector = getTranslationVector(player, tile, collision);
            add(player, translationVector);
            playerCollide(translationVector, tile);
            if (tile.id == Id.moving_platform) playerSnap(tile as DynamicTile, translationVector);
        }
        for (const bullet of getEntitiesNearEntity(tile, bullets)) {
            const platformBulletCollision = getCollision(tile, bullet);
            if (platformBulletCollision != null) {
                bulletCollide(bullet);
                if (tile.id == Id.cracked_intern_floor_tile) attackHit(tile as DynamicTile);
            }
        }
    }

    for (const enemy of getEntitiesNearEntity(player, enemies)) {
        const collision = getCollision(player, enemy)
        if (collision != null) {
            enemyCollide(enemy);
        }
        for (const bullet of getEntitiesNearEntity(enemy, bullets)) {
            const enemyBulletCollision = getCollision(enemy, bullet);
            if (enemyBulletCollision != null) {
                bulletHit(enemy);
                bulletCollide(bullet);
            }
        }
    }

    for (const cow of getEntitiesNearEntity(player, cows)) {
        const collision = getCollision(player, cow);
        if (collision != null && !cow.collected) {
            collect();
            disable(cow);
        }
    }
}

function getEntitiesNearEntity<T extends Rectangle>(entity: Rectangle, possibleCollisionEntities: T[]) {
    const closePlatforms = [];
    for (const possibleCollisionEntity of possibleCollisionEntities) {
        if (abs(possibleCollisionEntity.x - entity.x) <= Settings.playerCollisionGrid && abs(possibleCollisionEntity.y - entity.y) <= Settings.playerCollisionGrid) {
            closePlatforms.push(possibleCollisionEntity);
        }
    }
    return closePlatforms;
}

function getTranslationVector(player: Rectangle, rectangle: Rectangle, collision: Collision): Vector {
    const playerCenter = getCenter(player);
    const platformCenter = getCenter(rectangle);
    const xSign = sign(playerCenter.x - platformCenter.x);
    const ySign = sign(playerCenter.y - platformCenter.y);
    const translation = collision.w > collision.h ? { x: 0, y: ySign * collision.h } : { x: xSign * collision.w, y: 0 };
    return translation;
}

function xProject(rectangle: Rectangle): Vector {
    return { x: rectangle.x, y: rectangle.x + rectangle.w };
}

function yProject(rectangle: Rectangle): Vector {
    return { x: rectangle.y, y: rectangle.y + rectangle.h };
}

function getOverlap(s1: Vector, s2: Vector): Overlap | null {
    if (s1.y <= s2.x || s2.y <= s1.x) return null;
    return {
        x: Math.max(s1.x, s2.x),
        y: Math.min(s1.y, s2.y)
    };
}