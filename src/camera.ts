import { bounceLinear } from "./animation";
import { player, Player, respawn, resurrect } from "./player";
import { getCenter, Rectangle } from "./rectangle";
import { cameraRender } from "./renderer";
import { Settings } from "./settings";

export type Camera = Rectangle & {
    ox: number;
    oy: number;
    colorized: boolean;
}

export const camera: Camera = {
    x: Settings.playerSpawnX - 32,
    y: Settings.playerSpawnY - 80,
    w: Settings.cameraWidth,
    h: Settings.cameraHeight,
    ox: 0,
    oy: 0,
    colorized: true
};

let animation = bounceLinear(1, 0, 50, 100);
let isShutting = false;


export function update(delta: number) {

}

export function render() {
    if (isShutting) {
        let { current, halfway, complete } = animation();
        if (complete) {
            isShutting = false;
            current = 1;
            resurrect();
            camera.colorized = true;
        }
        if (halfway) {
            respawn();
            track(player);
        }
        camera.w = Settings.cameraWidth * current;
        camera.h = Settings.cameraHeight * current;
        camera.ox = Settings.cameraWidth / 2 - camera.w / 2;
        camera.oy = Settings.cameraHeight / 2 - camera.h / 2;
    }
    cameraRender(camera);
}

export function track(player: Player) {
    const playerCenter = getCenter(player);
    camera.x = playerCenter.x - Settings.cameraWidth / 2;
    camera.y = playerCenter.y - Settings.cameraHeight / 2;
}

export function shut() {
    isShutting = true;
    camera.colorized = false;
    animation = bounceLinear(1, 0, 50, 100);
}