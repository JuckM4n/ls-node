const db = require("../models/db");
const fs = require("fs");
const util = require("util");
const _path = require("path");

const validation = require("../libs/validation");
const psw = require("../libs/password");

const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

module.exports.index = async (ctx, next) => {
  const products = db.getState().products || [];

  const skills = db.getState().skills || [];

  ctx.render("pages/index", {
    title: "Main page",
    products,
    skills,
    msgemail: ctx.flash("msgemail")[0],
  });
};

module.exports.mail = async (ctx, next) => {
  const { name, email, message } = ctx.request.body;

  const dbPath = _path.join(__dirname, '../models/db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  try {
    if (!name || !email || !message) {
      ctx.flash("msgemail", "Заполните все поля!")
    } else {
      // Добавление данных в массив
      const mails = db.mails || [];
      mails.push({ name, email, message });
      // Запись обновленного массива в файл db.json
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }


    ctx.session.mails = ctx.session.mails || []
    ctx.flash("msgemail", "Сообщение отправлено");
  } catch (err) {
    ctx.flash("msgemail", err.message);
  }

  ctx.redirect("/#mail");
};

module.exports.login = async (ctx, next) => {
  if (ctx.session.isAuthorized) {
    return ctx.redirect("/admin");
  }

  ctx.render("pages/login", { msglogin: ctx.flash("msglogin")[0] });
};

module.exports.auth = async (ctx, next) => {
  const { email, password } = ctx.request.body;

  const user = db.getState().user;

  if (user.login === email && psw.validPassword(password)) {
    ctx.session.isAuthorized = true;
  } else {
    ctx.flash("msglogin", "Вы ввели неверный логин или пароль");
  }

  ctx.redirect("/admin");
};

module.exports.admin = async (ctx, next) => {
  if (!ctx.session.isAuthorized) {
    return ctx.redirect("/login");
  }

  const skills = db.getState().skills || [];

  ctx.render("pages/admin", {
    title: "Admin page",
    skills,
    msgskill: ctx.flash("msgskill")[0],
    msgfile: ctx.flash("msgfile")[0],
  });
};

module.exports.upload = async (ctx, next) => {
  const { product_name, product_price } = ctx.request.body;
  const { name, size, path } = ctx.request.files.photo;

  const responseError = validation(product_name, product_price, name, size);

  if (responseError) {
    await unlink(path);
    ctx.flash("msgfile", responseError);
  }

  const fileName = _path.join(process.cwd(), "upload", name);
  const errUpload = await rename(path, fileName);

  if (errUpload) {
    ctx.flash("msgfile", "При загрузке картинки произошла ошибка");
  } else {
    db.get("products")
      .push({
        src: _path.join("upload", name),
        name: product_name,
        price: product_price,
      })
      .write();

    ctx.flash("msgfile", "Товар успешно добавлен");
  }

  ctx.redirect("/admin");
};

module.exports.skills = async (ctx, next) => {
  const { age, concerts, cities, years } = ctx.request.body;

  db.get("skills").find({ id: "1" }).assign({ number: age }).write();

  db.get("skills").find({ id: "2" }).assign({ number: concerts }).write();

  db.get("skills").find({ id: "3" }).assign({ number: cities }).write();

  db.get("skills").find({ id: "4" }).assign({ number: years }).write();

  ctx.flash("msgskill", "Скилы успешно обновлены");
  ctx.redirect("/admin");
};
