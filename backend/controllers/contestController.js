import { Contest_Participants, User, UserProfile, Contest_Problems, Problems, TestCases, Contests, Submissions } from '../models/index.js';
import jwt from 'jsonwebtoken';

const joinContestController = async (req, res) => {
    const user = req.user;
    const contestId = req.body.contestId;

    try {
        await Contest_Participants.create({
            contestId,
            userId: user.id
        });

        return res.status(201).json({ message: 'Contest joined successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const isFirstTime = async (req, res) => {
    const user = req.user;
    const contestId = req.body.contestId;

    try {
        const contestParticipant = await Contest_Participants.findOne({
            where: { contestId, userId: user.id }
        });

        if (!contestParticipant) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        if (contestParticipant.is_disqualified) {
            return res.status(400).json({ message: 'You are disqualified from the contest' });
        }

        if (contestParticipant.isFirstTime) {
            contestParticipant.isFirstTime = false;
            await contestParticipant.save();

            return res.status(200).json({ message: 'First time' });
        } else {
            return res.status(400).json({ message: 'You have already submitted the contest' });
        }

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const rulesController = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    try {
        const token_ = token.split(' ')[1];
        const payload = jwt.verify(token_, process.env.JWT_SECRET);
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

        const { contestId } = req.body;
        if (!contestId) {
            return res.status(400).json({ message: 'Invalid call  err-m1' })
        }

        const contest = await Contests.findOne({
            where: { id: contestId }
        });

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        const startDate = new Date(contest.startDate);
        const endDate = new Date(contest.endDate);

        const currentDate = new Date();

        if (currentDate < startDate) {
            return res.status(400).json({ message: 'Contest not started yet' });
        }

        if (currentDate > endDate) {
            return res.status(400).json({ message: 'Contest already ended' });
        }

        const message = {
            username: user.username,
            name: user.name,
            email: user.email,
            image: user.profile.image,
            contestId: contest.id,
            contestName: contest.name,
        }

        return res.status(200).json({ message: message });

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Auth failed' });
    }
}


/**
* Get all the problems of the contest[id]
*/
const problemController = async (req, res) => {
    const { contestId } = req.body;
    if (!contestId) {
        return res.status(400).json({ message: 'Invalid call err-m1' })
    }

    const contest = await Contests.findOne({
        where: { id: contestId }
    });

    if (!contest) {
        return res.status(404).json({ message: 'Contest not found' });
    }

    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    const currentDate = new Date();

    if (currentDate < startDate) {
        return res.status(400).json({ message: 'Contest not started yet', errCode: 'notstart' });
    }

    if (currentDate > endDate) {
        return res.status(400).json({ message: 'Contest already ended', errCode: 'end01' });
    }

    try {

        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ message: 'Auth failed' });
        }

        const user = await User.findOne({
            where: { email: payload.email, username: payload.username },
            include: {
                model: UserProfile,
                as: 'profile',
                attributes: ['image']
            },
            attributes: ['id', 'username', 'name', 'email', 'institutionId']
        });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const contestParticipant = await Contest_Participants.findOne({
            where: { contestId, userId: user.id },
        });



        if (!contestParticipant) {
            return res.status(400).json({ message: 'Not a participant of the contest' });
        }

        if (contestParticipant.is_disqualified) {
            return res.status(400).json({
                message: 'You are disqualified from the contest',
                errCode: 'disqualified'
            });
        }

        if (contestParticipant.isFirstTime) {
            return res.status(400).json({ message: 'You have already submitted the contest' });
        }

        const problems = await Contest_Problems.findAll({
            where: { contestId },
            attributes: ['problemId']
        });

        if (!problems) {
            return res.status(404).json({ message: 'Problems not found' });
        }

        const problemIds = problems.map(problem => problem.problemId);

        const problemsDetails = await Problems.findAll({
            where: { id: problemIds },
            attributes: ['id', 'title', 'description', 'difficulty', 'time_limit', 'memory_limit', 'constraints', 'input_format', 'output_format']
        });

        if (!problemsDetails) {
            return res.status(404).json({ message: 'Problems not found' });
        }

        const problemsArray = [];

        for (const problem of problemsDetails) {
            const testCases = await TestCases.findAll({
                where: { problemId: problem.id, isPublic: true },
                attributes: ['input', 'output']
            });

            problemsArray.push({
                id: problem.id,
                title: problem.title,
                description: problem.description,
                difficulty: problem.difficulty,
                time_limit: problem.time_limit,
                memory_limit: problem.memory_limit,
                input_format: problem.input_format,
                output_format: problem.output_format,
                testCases: testCases,
                constraints: problem.constraints.split('\n')
            });
        }
        return res.status(200).json({
            username: user.username,
            name: user.name,
            email: user.email,
            endTime: contest.endDate,
            image: user.profile.image,
            score: contestParticipant.score,
            problems: problemsArray
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

const acceptController = async (req, res) => {
    const user = req.user;
    const contestId = req.body.contestId;

    try {
        var contestParticipant = await Contest_Participants.findOne({
            where: { contestId, userId: user.id }
        });

        if (!contestParticipant) {
            contestParticipant = await Contest_Participants.create({
                contestId,
                userId: user.id,
                isFirstTime: true
            });
        }

        if (contestParticipant.is_disqualified) {
            return res.status(400).json({ message: 'You are disqualified from the contest' });
        }

        if (!contestParticipant.isFirstTime) {
            return res.status(400).json({ message: 'You have already submitted the contest' });
        }
        return res.status(200).json({ message: 'Contest accepted' });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const contestDetails = async (req, res) => {
    const contestId = req.body.contestId;

    try {
        const contest = await Contests.findOne({
            where: { id: contestId }
        });

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Count number of participants
        const participants = await Contest_Participants.findAll({
            where: { contestId }
        });

        var count = 0;


        if (participants) {
            count = participants.length;
        }

        return res.status(200).json({
            name: contest.name,
            countPart: count,
            startDate: contest.startDate,
            endDate: contest.endDate,
            duration: contest.duration,
            description: contest.description
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getParticipantsByContestId = async (req, res) => {
    const contestId = req.params.id;

    try {
        const participants = await Contest_Participants.findAll({
            where: { contestId },
            include: {
                model: User,
                as: 'user',
                attributes: ['username','name'],
                include: {
                    model: UserProfile,
                    as: 'profile',
                    attributes: ['image']
                }
            },
            attributes: ['score', 'is_disqualified', 'last_submission_at'],
            order: [
                ['score', 'DESC'],
                ['last_submission_at', 'ASC']
            ]
        });


        if (!participants) {
            return res.status(404).json({ message: 'Participants not found' });
        }

        const participantsArray = [];

        for (const participant of participants) {
            if(participant.is_disqualified) {
                continue;
            }
            participantsArray.push({
                username: participant.user.username,
                name: participant.user.name,
                score: participant.score,
                last_submission_at: participant.last_submission_at,
                is_disqualified: participant.is_disqualified,
                image: participant.user.profile.image
            });
        }

        return res.status(200).json({ participants: participantsArray });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { joinContestController, rulesController, problemController, isFirstTime, acceptController, contestDetails, getParticipantsByContestId };