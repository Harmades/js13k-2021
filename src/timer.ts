import { Settings } from "./settings";
import { play_escape, stop_song } from "./sounds";

export let currentTime = Settings.timer;
let running = false;
export let timerHalfway = false;

export function update(delta: number) {
    if (!running) return;
    if (!timerHalfway && currentTime <= Settings.timerEscape) {
        timerHalfway = true;
        stop_song();
        play_escape();
    }
    if (currentTime <= 0) {
        currentTime = 0;
        return;
    }
    currentTime -= delta;
}

export function startTimer() {
    running = true;
}