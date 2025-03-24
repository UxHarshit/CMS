import { User, UserProfile, Problems, TestCases, Contests, Institution, Contest_Problems, Contest_Participants } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { isFirstTime } from './contestController.js';

const userListController = async (req, res) => {

    const { rangeStart, rangeEnd } = req.body;
    const users = await User.findAll({
        limit: rangeEnd,
        offset: rangeStart,
        include: [{
            as: 'profile',
            model: UserProfile,
            attributes: ['role', 'isVerified', 'isBanned']
        }]
    });
    const structuredUsers = users.map(user => {
        return {
            name: user.name,
            email: user.email,
            role: user.profile.role,
            isVerified: user.profile.isVerified,
            isBanned: user.profile.isBanned
        }
    })
    res.json(structuredUsers);
}

const problemListController = async (req, res) => {
    const { rangeStart, rangeEnd } = req.body;
    const problems = await Problems.findAll({
        limit: rangeEnd,
        offset: rangeStart
    });
    const structuredProblems = problems.map(problem => {
        return {
            id: problem.id,
            name: problem.title,
            difficulty: problem.difficulty,
            createdAt: new Date(problem.createdAt).toLocaleDateString()
        }
    })
    res.json(structuredProblems);
}

const deleteProblemController = async (req, res) => {
    const { id } = req.body;
    try {
        await Problems.destroy({
            where: {
                id: id
            }
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const addProblemController = async (req, res) => {
    const questionData = req.body;

    const transaction = await sequelize.transaction();
    try {
        const problem = await Problems.create({
            title: questionData.title,
            description: questionData.description,
            difficulty: questionData.difficulty,
            constraints: questionData.constraints,
            input_format: questionData.input_format,
            output_format: questionData.output_format,
            time_limit: questionData.time_limit,
            memory_limit: questionData.memory_limit,
        }, { transaction });

        const testCases = await TestCases.create({
            problemId: problem.id,
            input: questionData.public_test_cases.input,
            output: questionData.public_test_cases.output,
            isPublic: true,
            points: 0
        }, { transaction });

        console.log(questionData.test_cases);

        for (const testCase of questionData.test_cases) {
            await TestCases.create({
                problemId: problem.id,
                input: testCase.input,
                output: testCase.output,
                isPublic: false,
                points: testCase.points
            }, { transaction });
        }

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: "Problem added successfully"
        });

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error adding problem",
            error: error.message
        })
    }

}


const getAllContest = async (req, res) => {
    try {
        const { rangeStart, rangeEnd } = req.body;
        const contests = await Contests.findAll({
            limit: rangeEnd,
            offset: rangeStart,
            include: [{
                model: Institution,
                as: 'institution',
                attributes: ['name']
            }]
        });


        const structuredContests = contests.map(contest => {
            return {
                id: contest.id,
                name: contest.name,
                description: contest.description,
                startDate: contest.startDate,
                endDate: contest.endDate,
                institution: contest.institution.name
            }
        });

        res.json(structuredContests);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}


const getContestData = async (req, res) => {
    try {
        const { contestId } = req.body;

        const constest = await Contests.findOne({
            where: {
                id: contestId
            },
            include: [
                {
                    model: Problems,
                    as: 'problems',
                    attributes: ['id', 'title', 'difficulty'],
                    through: {
                        attributes: [] // remove the join table attributes
                    }
                },
                {
                    model: Institution,
                    as: 'institution',
                    attributes: ['name', 'code']
                }
            ]
        });

        const data = {
            id: constest.id,
            name: constest.name,
            description: constest.description,
            startDate: constest.startDate,
            endDate: constest.endDate,
            institution: constest.institution.name,
            code: constest.institution.code,
            problems: constest.problems.map(problem => {
                return {
                    id: problem.id,
                    title: problem.title,
                    difficulty: problem.difficulty
                }
            })
        }
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const getAllInstitution = async (req, res) => {
    try {
        const institutions = await Institution.findAll({
            attributes: ['name', 'code']
        });
        res.json(institutions);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const changeInstitution = async (req, res) => {
    try {
        const { contestId, institutionCode } = req.body;
        if (!contestId || !institutionCode) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }
        const constest = await Contests.findOne({
            where: {
                id: contestId
            }
        });
        const institution = await Institution.findOne({
            where: {
                code: institutionCode
            }
        });
        if (!constest || !institution) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }
        constest.institutionId = institution.id;
        await constest.save();
        res.json({
            success: true,
            message: "Institution changed successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const updateContest = async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }
        if (!data.id || !data.description || !data.name || !data.startDate || !data.endDate) {
            res.status(400).json({
                success: false,
                message: "Invalid request data"
            });
            return;
        }
        const contest = await Contests.findOne({
            where: {
                id: data.id
            }
        });

        if (!contest) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }

        contest.name = data.name;
        contest.description = data.description;
        contest.startDate = data.startDate;
        contest.endDate = data.endDate;
        await contest.save();
        res.json({
            success: true,
            message: "Contest updated successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteContestProblem = async (req, res) => {
    const { contestId, problemId } = req.body;
    if (!contestId || !problemId) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
        return;
    }
    const contest = Contests.findOne({
        where: {
            id: contestId
        }
    });
    if (!contest) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
        return;
    }

    const problem = Problems.findOne({
        where: {
            id: problemId
        }
    });
    if (!problem) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
    }

    Contest_Problems.destroy({
        where: {
            contestId: contestId,
            problemId: problemId
        }
    }).then(() => {
        res.json({
            success: true,
            message: "Problem removed from contest"
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    });
}

const searchProblem = async (req, res) => {
    const { problemId } = req.body;
    console.log(problemId);
    if (!problemId) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
        return;
    }
    try {
        const problem = await Problems.findOne({
            where: {
                id: problemId
            },
            attributes: ['id', 'title']
        });
        if (!problem) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }
        res.json(problem);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const addProblemToContest = async (req, res) => {
    const { contestId, problemId } = req.body;
    if (!contestId || !problemId) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
        return;
    }
    try {
        const contest = await Contests.findOne({
            where: {
                id: contestId
            }
        });
        const problem = await Problems.findOne({
            where: {
                id: problemId
            }
        });

        if (!contest || !problem) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }

        const constestProblem = await Contest_Problems.findOne({
            where: {
                contestId: contestId,
                problemId: problemId
            }
        });
        if (constestProblem) {
            res.status(400).json({
                success: false,
                message: "Problem already in contest"
            });
            return;
        }

        await Contest_Problems.create({
            contestId: contestId,
            problemId: problemId
        });
        res.json({
            success: true,
            message: "Problem added to contest"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const addContestController = async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }
        if (!data.name || !data.description || !data.startDate || !data.endDate || !data.institutionCode) {
            res.status(400).json({
                success: false,
                message: "Invalid request data"
            });
            return;
        }
        const institution = await Institution.findOne({
            where: {
                code: data.institutionCode
            }
        });
        if (!institution) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }

        const ress = await Contests.create({
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            allowedLanguages: ["c", "cpp", "java"],
            endDate: data.endDate,
            institutionId: institution.id
        });



        res.json({
            success: true,
            id : ress.id,
            message: "Contest added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteContest = async (req, res) => {
    const { contestId } = req.body;
    if (!contestId) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
        return;
    }
    try {

        const contest = await Contests.findOne({
            where: {
                id: contestId
            }
        });

        if (!contest) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }

        await Contests.destroy({
            where: {
                id: contestId
            }
        });
        res.json({
            success: true,
            message: "Contest deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const contestParticipants = async (req, res) => {
    const { contestId } = req.body;
    if (!contestId) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
        return;
    }
    try {
        const contest = await Contest_Participants.findAll({
            where: {
                contestId: contestId
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id','name', 'email', 'username'],
                include: [{
                    model: UserProfile,
                    as: 'profile',
                    attributes: ['role']
                }]
            }]
        });

        if (!contest) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }

        const data = {
            contestName: contest.name,
            participants: contest.map(participant => {
                return {
                    id: participant.user.id,
                    name: participant.user.name,
                    isFirstTime: participant.isFirstTime ? 1 : 0,
                    username: participant.user.username,
                    email: participant.user.email,
                    isDisqualified: participant.is_disqualified ? 1 : 0,
                    score: participant.score,
                }
            })
        }
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const enableUserTest = async (req, res) => {
    const { userId, contestId } = req.body;
    console.log(userId, contestId);
    if (!userId || !contestId) {
        res.status(400).json({
            success: false,
            message: "Invalid request params"
        });
        return;
    }
    try {
        const participant = await Contest_Participants.findOne({
            where: {
                userId: userId,
                contestId: contestId
            }
        });
        if (!participant) {
            res.status(400).json({
                success: false,
                message: "Invalid user"
            });
            return;
        }
        participant.isFirstTime = true;
        await participant.save();
        res.json({
            success: true,
            message: "User test enabled"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}



export {
    userListController, problemListController, addProblemController,
    deleteProblemController, getAllContest, getContestData, getAllInstitution,
    changeInstitution, updateContest, deleteContestProblem, searchProblem,
    addProblemToContest,addContestController,deleteContest,contestParticipants,
    enableUserTest
};
