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
    x: Settings.playerSpawnX,
    y: Settings.playerSpawnY + 2 * Settings.tileSize,
    color: "white",
    alpha: 0.5,
    radius: 64,
    angle: -PI
}

export function update(delta: number) {

}

export function render() {
    // drawGradientCircle(light);
}