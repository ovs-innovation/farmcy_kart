const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const sendEmail = (body) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      // service: process.env.SERVICE, //comment this line if you use custom server/domain
      port: process.env.EMAIL_PORT,
      secure: String(process.env.EMAIL_PORT) === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      // uncomment for debugging or custom servers (not recommended in prod)
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    transporter.verify((err, success) => {
      if (err) {
        console.error("Verification error:", err);
        if (err && err.code === 'EAUTH') {
          return reject(new Error("SMTP authentication failed: check EMAIL_USER and EMAIL_PASS (use App Password for Gmail). " + err.message));
        }
        return reject(err);
      }

      transporter.sendMail(body, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          return reject(err);
        }
        return resolve(info);
      });
    });
  });
};
//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const phoneVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 2,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
  phoneVerificationLimit,
};
