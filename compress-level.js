function compress(array) {
    let current = array[0];
    let currentOccurences = 1;
    const result = [];
    for (const i of array) {
       if (i != current) {
           result.push(String.fromCharCode(i % Math.pow(2, 31) + 65));
           result.push(currentOccurences.toString());
           current = i;
       } else {
           currentOccurences++;
       }
    }
    return result;
}
