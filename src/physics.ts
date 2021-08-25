import { Platform } from "./platform";
import { collide, Player } from "./player";
import { getCenter, Rectangle } from "./rectangle";
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

export function update(player: Player, platforms: Platform[]) {
    for (const platform of platforms) {
        const collision = getCollision(player, platform)
        if (collision != null) {
            const translationVector = getTranslationVector(player, platform, collision);
            add(player, translationVector);
            collide(translationVector);
        } else {
            platform.collision = false;
        }
    }
}

function getTranslationVector(player: Player, platform: Platform, collision: Collision): Vector {
    const playerCenter = getCenter(player);
    const platformCenter = getCenter(platform);
    const xSign = sign(playerCenter.x - platformCenter.x);
    const ySign = sign(playerCenter.y - platformCenter.y);
    const translation = collision.width > collision.height ? { x: 0, y: ySign * collision.height } : { x: xSign * collision.width, y: 0 };
    return translation;
}

function sign(value: number): number {
    const sign = Math.sign(value);
    return sign == 0 ? 1 : sign;
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