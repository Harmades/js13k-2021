import { abs } from "./alias";

export function createCounter(threshold: number) {
    let counter = 0;
    return () => {
        if (counter == threshold) {
            counter = 0;
            return true;
        } else {
            counter++;
            return false;
        }
    };
}

export function createLinear(from: number, to: number, duration: number) {
    let counter = 0;
    return () => {
        counter++;
        if (counter > duration) counter = duration;
        return from + (to - from) * counter / duration;
    }
}

export function bounceLinear(from: number, to: number, offset: number, duration: number) {
    let counter = -offset;
    const half = duration / 2;
    let reachedHalf = 0;
    return () => {
        counter++;
        if (counter <= 0) return { current: from, halfway: false, complete: false };
        if (counter > duration) counter = duration;
        if (reachedHalf <= 1 && counter >= half) reachedHalf++;
        return { current: -abs(half - counter) / half * (to - from) + to, halfway: reachedHalf == 1, complete: counter == duration };
    }
}