export function sign(value: number): number {
    const sign = Math.sign(value);
    return sign == 0 ? 1 : sign;
}

export function round(value: number) { return Math.round(value); }

export function floor(value: number) { return Math.floor(value); }