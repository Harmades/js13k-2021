import { Settings } from "./settings";

export let currentTime = Settings.timer;

export function update(delta: number) {
    if (currentTime <= 0) {
        currentTime = 0;
        return;
    }
    currentTime -= delta;
}