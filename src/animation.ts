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