import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { User, UserProfile, Contests, Contest_Participants } from '../models/index.js';
import sequelize from 'sequelize';

configDotenv();

const dashboardController = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: { email: payload.email, username: payload.username },
            include: {
                model: UserProfile,
                as: 'profile',
                attributes: ['image']
            },
            attributes: ['id', 'username', 'name', 'email', 'institutionId']
        });

        if (!user || !user.profile) {
            return res.status(404).json({ message: 'User or profile not found' });
        }

        const contests = await
            Contests.findAll({
                where: { institutionId: user.institutionId },
                attributes: ['id', 'name', 'description', 'startDate', 'endDate'],
                order: [['startDate', 'ASC']]
            });

        const totalParticipants = await Contest_Participants.findAll({
            attributes: ['contestId', [sequelize.fn('COUNT', sequelize.col('userId')), 'totalParticipants']],
            group: ['contestId']
        });

        const contestsData = totalParticipants.reduce((acc, curr) => {
            acc[curr.contestId] = curr.dataValues.totalParticipants;
            return acc;
        }, {});

        const contestsWithParticipants = contests.map(contest => ({
            ...contest.dataValues,
            totalParticipants: contestsData[contest.id] || 0
        }));


        const currentTime = new Date();
        const runningOrUpcommingContests = contestsWithParticipants.filter(contest => contest.startDate <= currentTime && contest.endDate >= currentTime);
        const pastContests = contestsWithParticipants.filter(contest => contest.endDate < currentTime);

        const response = {
            username: user.username,
            name: user.name,
            email: user.email,
            image: user.profile.image,
            contests: {
                running: runningOrUpcommingContests,
                past: pastContests
            }
        };

        return res.json(response);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default dashboardController;
