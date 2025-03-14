
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

        const verifyMail = await VerifyMail.findOne({ where: { userId: user.id } });

        if (verifyMail && new Date() - verifyMail.createdAt < 300000) { 
            return res.status(400).json({ message: 'Verification mail already sent', code: "ALREADY_SENT" });
        }


        const token = await generateToken(user);
        const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

        var mailBody = `Hello ${user.name},<br><br>`;
        mailBody += `You recently signed up for an account on CC Pro. To complete the registration process, you need to verify your email address.<br><br>`;
        mailBody += `Click the following link to verify your account: <a href="${verifyLink}">${verifyLink}</a>`;
        mailBody += `<br><br>Don't share this link with anyone. If you didn't request this, ignore this mail.`;
        const mailSent = await sendMailCustom(user.email, 'Verify your account', mailBody);

        if (!mailSent) {
            return res.status(500).json({ message: 'Error sending mail', code: "MAIL_ERROR" });
        }

        if (verifyMail) {
            await verifyMail.update({ createdAt: new Date() });
        } else {
            await VerifyMail.create({ userId: user.id , token: token , expiry : new Date() + 86400000 });
        }

        return res.status(200).json({ message: 'Verification mail sent', code: "MAIL_SENT" });

    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const verifyMailController = async (req, res) => {
    try{
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
        await verifyMail.destroy();
        return res.status(200).json({ message: 'User verified', code: "USER_VERIFIED" });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
    
    
        
export { resendVerificationController, verifyMailController };