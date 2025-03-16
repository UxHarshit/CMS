import nodemailer from "nodemailer";
import createMail from "../helpers/createMailTemplate.js";

const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 2525,
    // name: 'codecontestpro.tech',
    domain: 'codecontestpro.tech',
    secure: false,
    auth: {
        user: "api",
        pass: process.env.SERVER_MAIL_PASSWORD
    }
})

const sendMailCustom = async (recipient, subject, body) => {
    const mailOptions = {
        from: `CC Pro <${process.env.SERVER_MAIL}>`,
        to: recipient,
        subject: subject,
        html: createMail(body),
    }

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}


const sendMail = async (req, res) => {
    const { recipient, subject, body } = req.body;

    if (!recipient || !subject || !body) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        });
    }

    const mailSent = await sendMailCustom(recipient, subject, body);
    if (mailSent) {
        return res.status(200).json({
            success: true,
            message: "Mail sent successfully"
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "Error sending mail"
        });
    }
}

export { sendMail, sendMailCustom };