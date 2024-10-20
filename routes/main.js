const express = require("express");
const router = express.Router();
const db = require('../db/db');

const data = {
  skills: db.get('skills').value(),
  products: db.get('products').value(),
}

router.get("/", (req, res, next) => {

  res.render("pages/index", {
    title: "Main page",
    ...data,
    msgemail: req.flash("status")[0],
  });
});

router.post("/", (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    req.flash("status", "Заполните все поля!");
  } else {
    db.get('mails').push(req.body).write()

    req.flash('status', 'Сообщение успешно отправлено!')
  }
  res.redirect('/#mail')

});

module.exports = router;
