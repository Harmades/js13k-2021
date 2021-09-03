export const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    shift: false,
}

export type Input = typeof input;

onkeydown = onkeyup = event => setKey(event.keyCode, event.type[5] != undefined);

function setKey(keyCode: number, value: boolean) {
  // Up (up / W / Z)
  if (keyCode == 38 || keyCode == 90 || keyCode == 87) input.up = value;
  // Right (right / D)
  if (keyCode == 39 || keyCode == 68) input.right = value;
  // Down (down / S)
  if (keyCode == 40 || keyCode == 83) input.down = value;
  // Left (left / A / Q)
  if (keyCode == 37 || keyCode == 65 || keyCode == 81) input.left = value;
  // Shift (left / right)
  if (keyCode == 16) input.shift = value;
  // Space
  if (keyCode == 32) input.space = value;
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