import { User, UserProfile } from '../models/index.js';


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

export { basicUserInfo };

