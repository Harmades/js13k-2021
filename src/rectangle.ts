import { Vector } from "./vector";

export type Rectangle = Vector & {
    width: number;
    height: number;
}

export function collides(rectangle1: Rectangle, rectangle2: Rectangle) {
    // collides if there is an overlap on x axis and y axis
    return overlap(rectangle1, rectangle2) && overlap(yProject(rectangle1), yProject(rectangle2));
}

export function yProject(rectangle: Rectangle): Vector {
    return { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height };
}

export function overlap(s1: Vector, s2: Vector) {
    return !(s1.y < s2.x && s2.y < s1.x);
}