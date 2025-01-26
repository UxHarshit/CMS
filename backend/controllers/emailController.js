import nodemailer from "nodemailer";
import createMail from "../helpers/createMailTemplate.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVER_MAIL,
        pass: process.env.SERVER_MAIL_PASSWORD
    }
})


const sendMail = async (req, res) => {
  const { recipient, subject, body } = req.body;

  if (!recipient || !subject || !body) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields"
    });
  }

    const mailOptions = {
        from: `CC Pro <${process.env.SERVER_MAIL}>`,
        to: recipient,
        subject: subject,
        html: createMail(body),
    }

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export { sendMail };