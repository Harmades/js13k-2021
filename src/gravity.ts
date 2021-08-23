import { Rectangle } from "./rectangle";
import { Settings } from "./settings";

export function applyGravity(rectangle: Rectangle) {
    rectangle.y += Settings.gravity;
}