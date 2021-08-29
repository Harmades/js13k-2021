import { drawPattern } from "./renderer";
import { Settings } from "./settings";

export function render() {
    drawPattern("bg_tile.png", { x: 0, y: 0, w: Settings.width, h: Settings.height });
}