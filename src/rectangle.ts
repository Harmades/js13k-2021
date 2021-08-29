import { Vector } from "./vector";

export type Rectangle = Vector & {
    w: number;
    h: number;
}

export function getCenter(rectangle: Rectangle): Vector {
    return {
        x: rectangle.x + rectangle.w / 2,
        y: rectangle.y + rectangle.h / 2
    };
}