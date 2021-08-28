import { cows, disable } from "./cow";
import { Enemy } from "./enemy";
import { abs, sign } from "./math";
import { Platform } from "./platform";
import { collect, collide, die, Player } from "./player";
import { getCenter, Rectangle } from "./rectangle";
import { Settings } from "./settings";
import { add, Vector } from "./vector";

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
        width: xOverlap.y - xOverlap.x,
        height: yOverlap.y - yOverlap.x
    };
}

export function update(player: Player, platforms: Platform[], enemies: Enemy[]) {
    for (const platform of getEntitiesNearPlayer(player, platforms)) {
        if (!platform.collision) continue;
        const collision = getCollision(player, platform)
        if (collision != null) {
            const translationVector = getTranslationVector(player, platform, collision);
            add(player, translationVector);
            if (platform.type == "spikes") die();
            else collide(translationVector);
        }
    }

    for (const enemy of getEntitiesNearPlayer(player, enemies)) {
        const collision = getCollision(player, enemy)
        if (collision != null) {
            const translationVector = getTranslationVector(player, enemy, collision);
            add(player, translationVector);
            die();
        }
    }

    for (const cow of getEntitiesNearPlayer(player, cows)) {
        const collision = getCollision(player, cow);
        if (collision != null && !cow.collected) {
            collect();
            disable(cow);
        }
    }
}

function getEntitiesNearPlayer<T extends Rectangle>(player: Player, rectangles: T[]) {
    const closePlatforms = [];
    for (const rectangle of rectangles) {
        if (abs(rectangle.x - player.x) <= Settings.playerCollisionGrid && abs(rectangle.y - player.y) <= Settings.playerCollisionGrid) {
            closePlatforms.push(rectangle);
        }
    }
    return closePlatforms;
}

function getTranslationVector(player: Player, rectangle: Rectangle, collision: Collision): Vector {
    const playerCenter = getCenter(player);
    const platformCenter = getCenter(rectangle);
    const xSign = sign(playerCenter.x - platformCenter.x);
    const ySign = sign(playerCenter.y - platformCenter.y);
    const translation = collision.width > collision.height ? { x: 0, y: ySign * collision.height } : { x: xSign * collision.width, y: 0 };
    return translation;
}

function xProject(rectangle: Rectangle): Vector {
    return { x: rectangle.x, y: rectangle.x + rectangle.width };
}

function yProject(rectangle: Rectangle): Vector {
    return { x: rectangle.y, y: rectangle.y + rectangle.height };
}

function getOverlap(s1: Vector, s2: Vector): Overlap | null {
    if (s1.y <= s2.x || s2.y <= s1.x) return null;
    return {
        x: Math.max(s1.x, s2.x),
        y: Math.min(s1.y, s2.y)
    };
}