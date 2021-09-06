import { bulletCollide, bullets } from "./bullet";
import { cows, disable } from "./cow";
import { bulletHit, enemies, Enemy, enemyCollide } from "./enemy";
import { abs, sign } from "./alias";
import { Tile, tiles } from "./tile";
import { collect, collide, player, playerDie } from "./player";
import { getCenter, Rectangle } from "./rectangle";
import { Settings } from "./settings";
import { add, Vector } from "./vector";
import { Id } from "../gen/id";
import { movingTiles } from "./movingTile";

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
    for (const platform of getEntitiesNearEntity(player, [...tiles, ...movingTiles])) {
        if (!platform.collision) continue;
        const collision = getCollision(player, platform)
        if (collision != null) {
            const translationVector = getTranslationVector(player, platform, collision);
            add(player, translationVector);
            if (platform.id == Id.spikes) playerDie();
            else collide(translationVector);
        }
        for (const bullet of getEntitiesNearEntity(platform, bullets)) {
            const platformBulletCollision = getCollision(platform, bullet);
            if (platformBulletCollision != null) {
                bulletCollide(bullet);
            }
        }
    }

    for (const enemy of getEntitiesNearEntity(player, enemies)) {
        const collision = getCollision(player, enemy)
        if (collision != null) {
            const translationVector = getTranslationVector(player, enemy, collision);
            add(player, translationVector);
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