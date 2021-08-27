export function sign(value: number): number {
    const sign = Math.sign(value);
    return sign == 0 ? 1 : sign;
}