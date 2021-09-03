import { draw, drawRectOutline, drawText } from "./renderer";
import * as Player from "./player";
import * as Camera from "./camera";
import { Settings } from "./settings";
import { cows, cowSprite } from "./cow";
import { getCenter } from "./rectangle";
import { abs } from "./alias";

const uiFrame = {
    x: (Settings.cameraWidth - Settings.uiWidth) / 2,
    y: (Settings.cameraHeight - Settings.uiHeight) / 2,
    w: Settings.uiWidth,
    h: Settings.uiHeight
};

const scorePosition = {
    x: 190,
    y: 20
};

const margin = 4;

const sprite = {
    x: 5 * 16 + 5,
    y: 0 * 16 + 5,
    w: 10,
    h: 10
};

const title = "Space Cowboy";

export function update(delta: number) {

}

export function render() {
    draw(cowSprite, { x: scorePosition.x - cowSprite.w / 2, y: scorePosition.y - cowSprite.h / 2 });
    drawText(` x ${Player.player.cows}`, { x: scorePosition.x + cowSprite.w / 2, y: scorePosition.y + cowSprite.h / 2 });
    drawRectOutline(uiFrame, "#FFFFEB");

    for (const cow of cows) {
        if (cow.collected) continue;
        const cameraCenter = getCenter(Camera.camera);
        const cowCenter = getCenter(cow);
        if (abs(cowCenter.x - cameraCenter.x) > uiFrame.w / 2) {
            let x = uiFrame.x;
            if (cowCenter.x > cameraCenter.x) x += uiFrame.w;
            const y = uiFrame.w / 2 * (cowCenter.y - cameraCenter.y) / abs(cowCenter.x - cameraCenter.x) + uiFrame.h / 2;
            if (y > 0 && y < uiFrame.h) draw(sprite, { x: x - 4, y: uiFrame.y + y - 3 });
        }
        if (abs(cowCenter.y - cameraCenter.y) > uiFrame.h / 2) {
            let y = uiFrame.y;
            if (cowCenter.y > cameraCenter.y) y += uiFrame.h;
            const x = uiFrame.h / 2 * (cowCenter.x - cameraCenter.x) / abs(cowCenter.y - cameraCenter.y) + uiFrame.w / 2;
            if (x > 0 && x < uiFrame.w) draw(sprite, { x: uiFrame.x + x - 3, y: y - 4 });
        }
    }
}