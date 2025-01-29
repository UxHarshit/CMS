import { User, UserProfile, Problems,TestCases,Contests,Institution } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

const userListController = async (req, res) => {

    const { rangeStart, rangeEnd } = req.body;
    const users = await User.findAll({
        where: {
            id: {
                [Op.between]: [rangeStart, rangeEnd]
            }
        },
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
        where: {
            id: {
                [Op.between]: [rangeStart, rangeEnd]
            }
        }
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
    }
}

const addProblemController = async (req, res) => {
    const questionData = req.body;
    
    const transaction = await sequelize.transaction();
    try{
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
            where: {
                id: {
                    [Op.between]: [rangeStart, rangeEnd]
                },
            },
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
export { userListController, problemListController, addProblemController , deleteProblemController,getAllContest};
