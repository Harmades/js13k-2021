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