import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  // Transporter তৈরি করার সময় 'as any' ব্যবহার করা হয়েছে যাতে টাইপ কনফ্লিক্ট না হয়
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"), // স্ট্রিং থেকে নাম্বারে কনভার্ট করা হয়েছে
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as any);

  const { email, subject, template, data } = options;

  // ইমেইল টেমপ্লেট ফাইলের পাথ ঠিক করা
  const templatePath = path.join(__dirname, "../mails", template);

  // EJS দিয়ে ইমেইল টেমপ্লেট রেন্ডার করা
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;