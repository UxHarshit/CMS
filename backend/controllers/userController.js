import { User, UserProfile, VerifyMail } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { sendMailCustom } from './emailController.js';

const basicUserInfo = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        const profile = await UserProfile.findOne({ where: { userId: req.user.id } });

        const data = {
            username: user.username,
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
        }
        res.status(200).send(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const isVerified = async (req, res) => {
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
            res.status(200).send('Verified');
        } else {
            res.status(403).send({
                email: user.email,
                username: user.username,
                message: 'User not verified',
                code: "NOT_VERIFIED",
            });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


export { basicUserInfo, isVerified };
