const fs = require("fs");
const { PREAMBLE_BINARY, MESSAGE_LENGTH, toBinary } = require("./");
const toFind =
  "GOUDAPEPPERJACKPARMASEANAMERICANGOUDAPEPPERJACKPARMASEANAMERICANGOUDAPEPPERJACKPARMASEANAMERICANXXXX";
const toFindCropped = toFind.substring(0, 100);
console.log(toFind);
console.log(toFindCropped);
const chars = toBinary(toFindCropped);
console.log("chars", chars);
const fullData = "0101000101010" + PREAMBLE_BINARY + chars;
let fileData = "";
// console.log('fullData', fullData)
for (let count = 0; count < 1; count++) {
  fileData += fullData;
}
fs.writeFileSync("test_data.txt", fileData, "utf-8");
