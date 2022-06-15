import * as nodemailer from "nodemailer";
import * as hbs from "nodemailer-express-handlebars";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f01a8fa433023c",
    pass: "2bf9f21e8b36ae",
  },
});

transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".hbs",
        layoutsDir: "templates/",
        defaultLayout: "notification",
      },
      viewPath: "templates/",
      extName: ".hbs",
    })
);

export const mailer = transporter;
export const mailOptions = {
  from: "test@test.com",
  to: "to@to.com",
  subject: "Cadastro de arquivo",
  template: "notification",
};
