export const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    m: false,
    shift: false,
}

export type Input = typeof input;

document.addEventListener("keydown", event => setKey(event.key, true));
document.addEventListener("keyup", event => setKey(event.key, false));

function setKey(key: string, value: boolean) {
    if (key == "ArrowUp") input.up = value;
    if (key == "ArrowDown") input.down = value;
    if (key == "ArrowLeft") input.left = value;
    if (key == "ArrowRight") input.right = value;
    if (key == " ") input.space = value;
    if (key == "m") input.m = value;
    if (key == "Shift") input.shift = value;
}

export function update(delta: number) { }

export function createReleasedKeyPress(key: keyof Input) {
    let released = true;
    return () => {
        if (input[key] && released) {
            released = false;
            return true;
        }
        if (!input[key]) released = true;
        return false;
    };
}