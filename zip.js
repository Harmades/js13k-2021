const fs = require("fs");
const archiver = require("archiver");

const distDir = process.cwd() + "/dist";

const output = fs.createWriteStream(distDir + "/game.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);
archive.file(distDir + "/index.html", { name: "index.html" });
archive.file(distDir + "/bundle.js", { name: "bundle.js" });

archive.finalize();

const MAX_BYTES = 13312;
const filename = "./dist/game.zip";

fileSize = fs.statSync(filename).size;
fileSizeDifference = Math.abs(MAX_BYTES - fileSize);

if (fileSize <= MAX_BYTES) {
    console.log(`Hooray! The file is ${fileSize} bytes (${fileSizeDifference} bytes under the limit).`);
    process.exit(0);
} else {
    console.log(`Nuts! The file is ${fileSize} bytes (${fileSizeDifference} bytes over the limit).`);
    process.exit(1);
}
