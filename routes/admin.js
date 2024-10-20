const express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const Db = require("../db/");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const skills = await Db.skills;
    res.render("pages/admin", {
      title: "Admin page",
      skills,
      msgskill: req.flash("msgskill")[0],
      msgfile: req.flash("msgfile")[0],
    });
  } catch (err) {
    console.error(err);
    res.render("pages/admin", { title: "Admin page", msgskill: err });
  }
});

router.post("/skills", async (req, res, next) => {
  try {
    await Db.setSkills(req.body);

    req.flash("msgskill", "Скиллы успешнно сохранены");
  } catch (err) {
    req.flash("msgskill", err);
  }

  res.redirect("/admin");
});

router.post("/upload", (req, res, next) => {
  const form = new formidable.IncomingForm();
  const upload = path.normalize("public/assets/img/products");

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      req.flash("msgfile", "Ошибка");
      res.redirect("/admin");
    }

    const { name, price } = fields;

    if (!name && !price) {
      req.flash("msgfile", "Заполните все поля");
      res.redirect("/admin");
    }

    const fileName = path.join(upload, files.photo.originalFilename);

    fs.rename(files.photo.filepath, fileName, async function (err) {
      if (err) {
        req.flash("msgfile", "Ошибка");
        res.redirect("/admin");
      }

      await Db.addProduct(fields, files.photo.originalFilename);

      req.flash("msgfile", "Товар успешно добавлен");
      res.redirect("/admin");
    });
  });
});

module.exports = router;
