export type Vector = {
    x: number;
    y: number;
}

export function zero(): Vector {
    return {
        x: 0,
        y: 0
    }
}

export function add(vector1: Vector, vector2: Vector): void {
    vector1.x += vector2.x;
    vector1.y += vector2.y;
}

export function multiply(vector: Vector, value: number) {
    vector.x *= value;
    vector.y *= value;
}

export function subtract(vector1: Vector, vector2: Vector): void {
    vector1.x -= vector2.x;
    vector1.y -= vector2.y;
}