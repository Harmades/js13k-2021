import { PI } from "./alias";
import { drawGradientCircle } from "./renderer";
import { Settings } from "./settings";
import { Vector } from "./vector";

export type Light = Vector & {
    radius: number;
    alpha: number;
    color: string;
    angle: number;
}

const light: Light = {
    x: Settings.playerSpawnX - 3 * 16,
    y: Settings.playerSpawnY + 16 - 3 * 16,
    color: "white",
    alpha: 0.5,
    radius: 64,
    angle: PI / 2
}

export function update(delta: number) {

}

export function render() {
    drawGradientCircle(light);
}