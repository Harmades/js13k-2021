const fs = require("fs");
const path = require("path");
const parseString = require('xml2js').parseString;

function arrayToString(array) {
    const result = [];
    for (let i of array) {
        let id = String.fromCharCode(i % Math.pow(2, 29) + 97);
        let flip = 0;
        if (hFlipped(i)) flip += Math.pow(2, 2);
        if (vFlipped(i)) flip += Math.pow(2, 1);
        if (dFlipped(i)) flip += Math.pow(2, 0);
        if (flip != 0) id = id + "" + flip.toString();
        result.push(id);
    }
    return '"' + result.join("") + '"';
}

function hFlipped(id) {
    return (id & (1 << 31)) != 0;
}

function vFlipped(id) {
    return (id & (1 << 30)) != 0;
}

function dFlipped(id) {
    return (id & (1 << 29)) != 0;
}

// Read Tiled map
const data = fs.readFileSync(process.cwd() + "/asset/escape.json").toString();
const json = JSON.parse(data);
const content = `export const level = [${json.layers.map(layer => arrayToString(layer.data)).join(",")}]`;
fs.writeFileSync(process.cwd() + "/gen/level.ts", content);

const xml = fs.readFileSync(process.cwd() + `/asset/${json.tilesets[0].source}`).toString();
let ids = {};
parseString(xml, (err, result) => {
    for (const tile of result.tileset.tile) {
        const source = path.basename(tile.image[0].$.source, ".png");
        const id = tile.$.id;
        ids[source] = Number.parseInt(id);
    }
});
const idsObject = `export const Id = ${JSON.stringify(ids)}`;
fs.writeFileSync(process.cwd() + "/gen/id.ts", idsObject);