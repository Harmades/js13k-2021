export type Input = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export const input: Input = {
    up: false,
    down: false,
    left : false,
    right: false
}

document.addEventListener("keydown", event => setKey(event.key, true));
document.addEventListener("keyup", event => setKey(event.key, false));

function setKey(key: string, value: boolean) {
    if (key == "ArrowUp") input.up = value;
    if (key == "ArrowDown") input.down = value;
    if (key == "ArrowLeft") input.left = value;
    if (key == "ArrowRight") input.right = value;
}