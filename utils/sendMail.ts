require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        secure: false,
        port: parseInt(process.env.SMTP_PORT || '587'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const { email, subject, template, data } = options;

    // Đưa PDATH vào tệp mẫu email
    const templatePath = path.join(__dirname, '../mails', template);

    // Hiển thị mẫu email với EJS
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
    console.log("Có chạy ở đây nhé");
};

export default sendMail;