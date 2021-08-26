export type Input = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    gamepadConnected: boolean;
}

export const input: Input = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    gamepadConnected: false
}

let currentGamepadIndex = 0;
// let gamepad: Gamepad | null = null;

document.addEventListener("keydown", event => setKey(event.key, true));
document.addEventListener("keyup", event => setKey(event.key, false));
window.addEventListener("gamepadconnected", event => setGamepad(event.gamepad.index, true));
window.addEventListener("gamepaddisconnected", event => setGamepad(event.gamepad.index, false));

function setKey(key: string, value: boolean) {
    if (key == "ArrowUp") input.up = value;
    if (key == "ArrowDown") input.down = value;
    if (key == "ArrowLeft") input.left = value;
    if (key == "ArrowRight") input.right = value;
    if (key == " ") input.space = value;
}

function setGamepad(gamepadIndex: number, connected: boolean) {
    input.gamepadConnected = connected;
    currentGamepadIndex = gamepadIndex;
}

export function update(delta: number) {
    if (!input.gamepadConnected) return;
    const gamepad = navigator.getGamepads()[currentGamepadIndex];
    if (gamepad == null) return;
    input.up = gamepad.buttons[12].pressed;
    input.down = gamepad.buttons[13].pressed;
    input.left = gamepad.buttons[14].pressed;
    input.right = gamepad.buttons[15].pressed;
}