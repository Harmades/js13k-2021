import { draw, drawRectOutline, drawText } from "./renderer";
import * as Player from "./player";
import * as Camera from "./camera";
import { Settings } from "./settings";
import { cows, cowSprite } from "./cow";
import { getCenter } from "./rectangle";
import { abs, floor, getElementById } from "./alias";
import { currentTime, timerHalfway } from "./timer";
import * as Game from "./game";
import { play_cowboy, stop_song } from "./sounds";
import { lava, lavaSpriteTop } from "./lava";

const uiFrame = {
    x: (Settings.cameraWidth - Settings.uiWidth) / 2,
    y: (Settings.cameraHeight - Settings.uiHeight) / 2,
    w: Settings.uiWidth,
    h: Settings.uiHeight,
    color: "#FFFFEB"
};

const scorePosition = {
    x: 190 + cowSprite.w / 2,
    y: 20 + cowSprite.h / 2
};
const timerPosition = {
    x: 15 + cowSprite.w / 2,
    y: 20 + cowSprite.h / 2
};
const lavaPosition = {
    x: 15 + cowSprite.w / 2 + Settings.tileSize,
    y: 120 + cowSprite.h / 2 + Settings.tileSize
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
    collected: false,
    dead: false
};
const white = "#FFFFEB";
const red = "#EB564B";

export function update(delta: number) {

}

export function render() {
    draw(cowSprite, { x: scorePosition.x - cowSprite.w, y: scorePosition.y - cowSprite.h });
    drawText(` x ${Player.player.cows}`, 12, scorePosition);
    drawText(`${floor(currentTime / 60)}:${(currentTime % 60 < 10 ? 0 : '')}${floor(currentTime % 60)}`, 12, timerPosition, timerHalfway ? red : white);
    draw(lavaSpriteTop, { x: lavaPosition.x - Settings.tileSize, y: lavaPosition.y - Settings.tileSize});
    drawText(` ${floor((lava.y - Player.player.y) / Settings.tileSize)}m`, 12, lavaPosition);
    drawRectOutline(uiFrame);

    for (const target of [...cows, end]) {
        if (target.collected || target.dead) continue;
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

export function gg() {
    Game.stop();
    stop_song();
    play_cowboy();
    getElementById("ui")!.style.display = "block";
    const playerCows = Player.player.cows;
    const remainingCows = cows.length - playerCows;
    getElementById("ui-text")!.innerHTML = `
    Congratulations! You completed Space Cowboy.<br/><br/>
    You saved ${playerCows} ${pluralize(playerCows)} and left ${remainingCows} ${pluralize(remainingCows)} to die in the lava.<br/>

    Game made with love by:<br/><br/>
    Adrian Lissot<br/>
    Barthélémy Renucci<br/>
    Florent Perez<br/>
    `;
}

function pluralize(length: number) {
    return `cow${length == 1 ? '' : 's'}`;
}

export function notGg() {
    Game.stop();
    getElementById("ui-text")!.innerHTML = "You died in lava.<br/><br/>Miserably.<br/><br/>Reload page to restart the game.";
    getElementById("ui")!.style.display = "block";
}

export function showStartScreen() {
    const listener = (e: KeyboardEvent) => {
        if (e.keyCode != 32) return;
        hideUiScreen();
        play_cowboy();
        Camera.track(Player.player);
        Game.render();
        Game.start();
        removeEventListener("keyup", listener);
    }
    addEventListener("keyup", listener);
    getElementById("ui-text")!.innerHTML = "Save the cows! Or rush to the end 🚩.<br/><br/>WASD/Arrows: move&jump<br/>SHIFT: morph to cow/human form<br/>SPACEBAR: charge(cow)/shoot(human)<br/><br/>SHOOT butchers with KNIVES, CHARGE butchers with SHIELDS as shown below.<br/><br/>Picking up a cow grants you a CHECKPOINT. Be careful, LAVA is rising!<br/><br/>Press SPACE to start Space Cowboy.";
    getElementById("ui")!.style.display = "block";
}

export function hideUiScreen() {
    getElementById("ui")!.style.display = "none";
}