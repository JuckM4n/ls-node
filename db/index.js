const path = require("path");
const fs = require("fs");
const util = require("util");
 
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
 
const dataFile = path.normalize(path.resolve(__dirname, "data.json"));
 
class Db {
  constructor() {
    this.init();
  }

  async init() {
    const readData = await readFile(dataFile, "utf-8");

    this.db = JSON.parse(readData);
  }

  get skills() {
    return this.db.skills || {};
  }

  get products() {
    return this.db.products || {};
  }

  async setSkills(skills) {
    this.db.skills[0].number = skills.age;
    this.db.skills[1].number = skills.concerts;
    this.db.skills[2].number = skills.cities;
    this.db.skills[3].number = skills.years;

    await writeFile(dataFile, JSON.stringify(this.db), "utf8");
  }

  async addProduct(fields, file) {
    this.db.products.push({
      src: `./assets/img/products/${file}`,
      name: fields.name,
      price: fields.price,
    });

    await writeFile(dataFile, JSON.stringify(this.db), "utf8");
  }
}

module.exports = new Db();
