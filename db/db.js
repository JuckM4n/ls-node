const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const adapter = new FileSync(path.join(__dirname, "data.json"));

module.exports = low(adapter);