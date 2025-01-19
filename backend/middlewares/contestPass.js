import { Contests, Contest_Participants } from '../models/index.js';

const contestPass = async (req, res, next) => {
    const user = req.user;
    const contestId = req.params.contestId;

    if (!contestId) {
        return res.status(400).json({ message: 'Invalid call  err-m1' })
    }

    // Check contest is valid
    const contest = await Contests.findByPk(contestId);
    if (!contest) {
        return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if user is first time participant
    const participant = await Contest_Participants.findOne({
        where: { contestId: contestId, userId: user.id }
    });
    if (!participant.isFirstTime) {
        return res.status(403).json({ message: 'You are not a first time participant of this contest' });
    }

    // Check if contest is started
    if (contest.startDate > new Date()) {
        return res.status(403).json({ message: 'Contest has not started yet' });
    }

    // Check if contest is ended
    if (contest.endDate < new Date()) {
        return res.status(403).json({ message: 'Contest has ended' });
    }

    // Check if user is disqualified
    if (participant.is_disqualified) {
        return res.status(403).json({ message: 'You are disqualified from this contest' });
    }

    next();
};

export default contestPass;