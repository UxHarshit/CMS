
import { User, UserProfile, VerifyMail } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { sendMailCustom } from './emailController.js';


var generateToken = async (user) => {
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
}


const resendVerificationController = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.auth.email, username: req.auth.username },
            attributes: ['id', 'username', 'name', 'email', 'institutionId'],
            include: {
                model: UserProfile,
                as: 'profile',
                attributes: ['image', 'isAdmin', 'isSuperAdmin', 'isVerified', 'isBanned', 'role']
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found', code: "USER_NOT_FOUND" });
        }

        if (user.profile.isVerified) {
            return res.status(400).json({ message: 'User is already verified', code: "ALREADY_VERIFIED" });
        }

        var verifyMail = await VerifyMail.findOne({ where: { userId: user.id } });

        if (verifyMail && new Date() - verifyMail.createdAt < 300000) {
            return res.status(400).json({ message: 'Verification mail already sent', code: "ALREADY_SENT" });
        }


        const token = await generateToken(user);
        const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

        const mailBody = `
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up for <strong>CC Pro</strong>. Please verify your email address to activate your account.</p>

        <p style="text-align: center;">
            <a href="${verifyLink}" style="
                display: inline-block;
                background-color: #007BFF;
                color: #ffffff;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 6px;
                box-shadow: 0 4px 6px rgba(0, 123, 255, 0.2);
                transition: background-color 0.3s ease-in-out;
            " onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007BFF'">
                Verify My Account
            </a>
        </p>

        <p>If the button above does not work, you can also click the following link:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>

        <p>This link is valid for 24 hours. If you did not request this, please ignore this email.</p>

        <br>
        <p>Best regards,<br><strong>CC Pro Team</strong></p>
        <br>
        <hr>
        <p style="font-size: 12px; color: #888888;">
            This email was sent from <a href="https://codecontestpro.tech">codecontestpro.tech</a>.
            If you need any assistance, please contact us at
            <a href="mailto:contact@codecontestpro.tech">contact@codecontestpro.tech</a>.
        </p>
    `;

        const mailSent = await sendMailCustom(user.email, 'Verify your account', mailBody);

        if (!mailSent) {
            return res.status(500).json({ message: 'Error sending mail', code: "MAIL_ERROR" });
        }

        if (verifyMail) {
            await verifyMail.update({ createdAt: new Date() });
        } else {
            await VerifyMail.create({ userId: user.id, token: token, expiry: new Date() + 86400000 });
        }

        return res.status(200).json({ message: 'Verification mail sent', code: "MAIL_SENT" });

    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const verifyMailController = async (req, res) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ message: 'Token not provided', code: "TOKEN_NOT_PROVIDED" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: 'Invalid token', code: "INVALID_TOKEN" });
        }
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found', code: "USER_NOT_FOUND" });
        }
        const verifyMail = await VerifyMail.findOne({ where: { userId: user.id } });
        if (!verifyMail) {
            return res.status(400).json({ message: 'Verification mail not sent', code: "MAIL_NOT_SENT" });
        }
        if (verifyMail.token !== token) {
            return res.status(400).json({ message: 'Invalid token', code: "INVALID_TOKEN" });
        }
        if (new Date() - verifyMail.createdAt > 86400000) {
            return res.status(400).json({ message: 'Token expired', code: "TOKEN_EXPIRED" });
        }
        const profile = await UserProfile.findOne({ where: { userId: user.id } });
        if (profile.isVerified) {
            return res.status(400).json({ message: 'User already verified', code: "ALREADY_VERIFIED" });
        }
        await profile.update({ isVerified: true });
        //await verifyMail.destroy();
        return res.status(200).json({ message: 'User verified', code: "USER_VERIFIED" });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}



export { resendVerificationController, verifyMailController };