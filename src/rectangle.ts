import { Vector } from "./vector";

export type Rectangle = Vector & {
    width: number;
    height: number;
}

export function getCenter(rectangle: Rectangle): Vector {
    return {
        x: rectangle.x + rectangle.width / 2,
        y: rectangle.y + rectangle.height / 2
    };
}