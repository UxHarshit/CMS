import { User, UserProfile, Institution } from '../models/index.js';

const profileController = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).send({ message: 'Invalid request.' });
        }
        const user = await User.findOne({
            where: { username },
            include: { model: Institution, as: 'institution' }
        });
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const profile = await UserProfile.findOne({ where: { userId: user.id } });

        const joinedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
        }).format(new Date(user.createdAt));
        
        const data = {
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: profile.profilePicture,
            avatar: profile.image,
            bio: profile.bio,
            institution_name: user.institution.name,
            joinedDate,
            achievements: profile.achievements,
            location: profile.location,
        };
        res.status(200).send(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export default profileController;