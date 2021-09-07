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
    h: Settings.uiHeight,
    color: "#FFFFEB"
};

const scorePosition = {
    x: 190,
    y: 20
};
const sprite = {
    x: cowSprite.x + 5,
    y: cowSprite.y + 5,
    w: 10,
    h: 10
};
const end = {
    x: Settings.endX,
    y: Settings.endY,
    w: 0,
    h: 0,
    text: "🚩",
    collected: false
};
const title = "Space Cowboy";

export function update(delta: number) {

}

export function render() {
    draw(cowSprite, { x: scorePosition.x - cowSprite.w / 2, y: scorePosition.y - cowSprite.h / 2 });
    drawText(` x ${Player.player.cows}`, 12, { x: scorePosition.x + cowSprite.w / 2, y: scorePosition.y + cowSprite.h / 2 });
    drawRectOutline(uiFrame);

    for (const target of [...cows, end]) {
        if (target.collected) continue;
        const cameraCenter = getCenter(Camera.camera);
        const targetCenter = getCenter(target);
        if (abs(targetCenter.x - cameraCenter.x) > uiFrame.w / 2) {
            let x = uiFrame.x;
            if (targetCenter.x > cameraCenter.x) x += uiFrame.w;
            const y = uiFrame.w / 2 * (targetCenter.y - cameraCenter.y) / abs(targetCenter.x - cameraCenter.x) + uiFrame.h / 2;
            if (y > 0 && y < uiFrame.h) {
                const asEnd = target as typeof end;
                if (asEnd.text != null) {
                    drawText(asEnd.text, 8, { x: x - 4, y: uiFrame.y + y + 4 });
                } else {
                    draw(sprite, { x: x - 4, y: uiFrame.y + y - 4 });
                }
            }
        }
        if (abs(targetCenter.y - cameraCenter.y) > uiFrame.h / 2) {
            let y = uiFrame.y;
            if (targetCenter.y > cameraCenter.y) y += uiFrame.h;
            const x = uiFrame.h / 2 * (targetCenter.x - cameraCenter.x) / abs(targetCenter.y - cameraCenter.y) + uiFrame.w / 2;
            if (x > 0 && x < uiFrame.w) {
                const asEnd = target as typeof end;
                if (asEnd.text != null) {
                    drawText(asEnd.text, 8, { x: uiFrame.x + x - 4, y: y + 4 });
                } else {
                    draw(sprite, { x: uiFrame.x + x - 4, y: y - 4 });
                }
            }
        }
    }
}