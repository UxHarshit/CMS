import axios from 'axios';
import { Problems, Contest_Problems, Contests, TestCases } from '../models/index.js';
import sequelize  from '../config/database.js';


const JUDGE0_API = "http://139.59.69.105:2358/submissions";
const toBase64 = (str) => Buffer.from(str).toString("base64");


const runProblemController = async (req, res) => {
    const { language_id, code, stdin } = req.body;

    if (!language_id || !code) {
        return res.status(400).json({ message: 'Please provide language_id and code' });
    }

    const { contestId, problemId } = req.body;

    if (!contestId || !problemId) {
        return res.status(400).json({ message: 'Please provide contestId and problemId' });
    }

    try {
        const isContestProblem = await Contest_Problems.findOne({
            where: {
                contestId,
                problemId,
            },
        });

        if (!isContestProblem) {
            return res.status(400).json({ message: 'Problem is not in the contest' });
        }

        const contest = await Contests.findOne({ where: { id: contestId } });

        if (!contest) {
            return res.status(400).json({ message: 'Contest not found' });
        }

        const endDate = new Date(contest.endDate);
        const currentDate = new Date();

        if (endDate < currentDate) {
            return res.status(400).json({ message: 'Contest has ended', errCode: 'end01' });
        }

        const problem = await Problems.findOne({ where: { id: problemId } });

        if (!problem) {
            return res.status(400).json({ message: 'Problem not found' });
        }

        const { title, time_limit, memory_limit } = problem;

        const testCases = await TestCases.findAll({ where: { problemId, isPublic: true } });
        const inputs = testCases.map(testCase => testCase.input);
        const outputs = testCases.map(testCase => testCase.output);

        const data = {
            language_id,
            source_code: code,
            stdin: inputs.join('\n'),
            expected_output: outputs.join('\n'),
            encode: true,
            //cpu_time_limit: time_limit,
            //memory_limit,
        };


        const response = await axios.post(JUDGE0_API, data);

        // poll for the result
        const token = response.data.token;
        let result = null;

        while (true) {
            const resultResponse = await axios.get(`${JUDGE0_API}/${token}?base64_encoded=true`);
            result = resultResponse.data;

            if (result.status.id > 2) {
                break;
            }
        }


        res.status(200).json({
            message: result.status.description,
            stderr: result.stderr,
            time: result.time,
            stdout: result.stdout,
            compile_output: result.compile_output,
            expected_output: outputs.join('\n'),
            data: result
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};

const getProblemController = async (req, res) => {
    const { id } = req.params;
    const question = await Problems.findOne({ where: { id } });
    const testCases = await TestCases.findAll({ where: { problemId: id } });

    const data = {
        question,
        testCases
    }

    res.status(200).json(data);
}

const updateProblemController = async (req, res) => {
    const { id } = req.params;
    const { question, testCases} = req.body;
    const transaction = await sequelize.transaction();

    try{

        const problem = await Problems.findOne({ where: { id } });
        if(!problem)
        {
            return res.status(404).json({ message: 'Problem not found' });
        }
        
        // delete the old test cases
        await TestCases.destroy({ where: { problemId: id }, transaction });

        
        await Problems.update(question, { where: { id }, transaction });

        // create the new test cases
        for (const testCase of testCases) {
            await TestCases.create({
                problemId: id,
                input: testCase.input,
                output: testCase.output,
                isPublic: testCase.isPublic,
                points: testCase.points,
            }, { transaction });
        }

        await transaction.commit();

        res.status(200).json({ message: 'Problem updated successfully' });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { runProblemController, getProblemController, updateProblemController };