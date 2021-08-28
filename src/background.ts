import { drawPattern } from "./renderer";
import { Settings } from "./settings";

export function render() {
    drawPattern("bg_tile.png", { x: 0, y: 0, width: Settings.width, height: Settings.height });
}