const fs = require("fs");
const path = require("path");
const parseString = require('xml2js').parseString;

function arrayToString(array) {
    const result = [];
    for (let i of array) {
        result.push(String.fromCharCode(i % Math.pow(2, 31) + 97));
    }
    return '"' + result.join("") + '"';
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