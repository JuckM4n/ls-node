const nodemailer = require("nodemailer");

module.exports = (name, email, message) => {
  if (!name || !email || !message) {
    throw new Error("Заполните все поля");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "adell.aufderhar37@ethereal.email",
      pass: "NwweNZTUKCDewJKZxM",
    },
  });

  const info = {
    from: `"${name}" <${email}>`,
    to: "adell.aufderhar37@ethereal.email",
    subject: "Сообщение с сайта",
    text: message.trim().slice(0, 500) + `\n Отправлено с <${email}>`,
  };

  transporter.sendMail(info, function (err, info) {
    if (err) {
      throw new Error(`При отправке произошла ошибка ${err}`);
    }
  });
};
