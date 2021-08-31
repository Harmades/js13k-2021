const fs = require("fs");

function compress(array) {
    let current = array[0];
    let currentOccurences = 0;
    const result = [String.fromCharCode(current % Math.pow(2, 31) + 65)];
    for (let i of array) {
       if (i != current) {
           result.push(currentOccurences.toString());
           result.push(String.fromCharCode(i % Math.pow(2, 31) + 65));
           current = i;
           currentOccurences = 0;
       } else {
           currentOccurences++;
       }
    }
    return result.join("");
}

function arrayToString(array) {
    const result = [];
    for (let i of array) {
        result.push(String.fromCharCode(i % Math.pow(2, 31) + 65));
    }
    return '"' + result.join("") + '"';
}

const data = fs.readFileSync(process.cwd() + "/asset/lvl_test.json").toString();
const json = JSON.parse(data);
const level = arrayToString(json.layers[1].data);
fs.writeFileSync(process.cwd() + "/asset/level.json", level);