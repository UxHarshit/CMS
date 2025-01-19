import { User, UserProfile } from '../models/index.js';


const basicUserInfo = async (req, res, next) => {
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
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.profile.isBanned) {
        return res.status(403).json({ message: 'You are banned from this platform' });
    }

    if (!user.profile.isVerified) {
        return res.status(403).json({ message: 'You are not verified' });
    }

    req.user = user;
    next();
};

export default basicUserInfo;
