import { configDotenv } from 'dotenv';
import { Contests, Contest_Participants } from '../models/index.js';
import sequelize from 'sequelize';

configDotenv();

const dashboardController = async (req, res) => {
    try {

        const user = req.user;

        const contests = await
            Contests.findAll({
                where: { institutionId: user.institutionId },
                attributes: ['id', 'name', 'description','startDate', 'endDate'],
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
            isAdmin: user.profile.isAdmin,
            image: user.profile.image,
            contests: {
                running: runningOrUpcommingContests,
                past: pastContests
            }
        };

        return res.json(response);
    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default dashboardController;
