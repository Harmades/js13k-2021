import { drawText } from "./renderer";
import * as Player from "./player";

export function update(delta: number) {

}

export function render() {
    drawText(`🐄 x ${Player.player.cows}`);
}