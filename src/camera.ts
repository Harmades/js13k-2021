import { Player } from "./player";
import { getCenter, Rectangle } from "./rectangle";
import { cameraRender } from "./renderer";
import { Settings } from "./settings";

export type Camera = Rectangle

const camera: Camera = {
    x: 0,
    y: 0,
    width: Settings.cameraWidth,
    height: Settings.cameraHeight,
}

export function update(delta: number) {

}

export function render() {
    cameraRender(camera);
}

export function track(player: Player) {
    const playerCenter = getCenter(player);
    camera.x = playerCenter.x - camera.width / 2;
    camera.y = playerCenter.y - camera.height / 2;
}