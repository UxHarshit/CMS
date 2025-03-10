import axios from 'axios';
import { Problems, Contest_Problems, Contests, TestCases, Submissions, Contest_Participants, Solved } from '../models/index.js';
import getLanguageTime from '../helpers/getLanguageTime.js';
import sequelize from '../config/database.js';
import crypto from 'crypto';


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

        var { title, time_limit, memory_limit } = problem;

        time_limit = getLanguageTime(language_id, time_limit);
        memory_limit *= 1024;

        const testCases = await TestCases.findAll({ where: { problemId, isPublic: true } });
        const inputs = testCases.map(testCase => testCase.input);
        const outputs = testCases.map(testCase => testCase.output);

        const data = {
            language_id,
            source_code: code,
            stdin: inputs.join('\n'),
            expected_output: outputs.join('\n'),
            encode: true,
            cpu_time_limit: time_limit,
            memory_limit,
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

const isSolvedQuestionController = async (req, res) => {
    const { problemId, contestId } = req.body;

    const { id: userId } = req.user;

    try {
        const isSolved = await Solved.findOne({
            where: {
                problemId,
                userId,
                contestId
            }
        });

        if (isSolved) {
            return res.status(200).json({ isSolved: true });
        }
        return res.status(200).json({ isSolved: false });

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
    const { question, testCases } = req.body;
    const transaction = await sequelize.transaction();

    try {

        const problem = await Problems.findOne({ where: { id } });
        if (!problem) {
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

function generateUidFromTokens(tokens) {
    const hash = crypto.createHash('sha256');
    hash.update(tokens.join(',')); // Convert array to string and hash it
    return hash.digest('hex').substring(0, 16); // Take first 16 chars for a short UID
}

const submitProblemController = async (req, res) => {
    try {
        const { language_id, code, stdin, contestId, problemId } = req.body;
        if (!language_id || !code || !contestId || !problemId) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Fetch contest, problem, and contest validation in parallel
        const [isContestProblem, contest, problem, testCases] = await Promise.all([
            Contest_Problems.findOne({ where: { contestId, problemId } }),
            Contests.findOne({ where: { id: contestId } }),
            Problems.findOne({ where: { id: problemId } }),
            TestCases.findAll({ where: { problemId } })
        ]);

        const isAlreadySolved = await Solved.findOne({
            where: {
                userId: req.user.id,
                problemId,
                contestId,
            }
        });

        if (isAlreadySolved) {
            return res.status(400).json({ message: 'Problem already solved' });
        }

        if (!isContestProblem) return res.status(400).json({ message: 'Problem is not in the contest' });
        if (!contest) return res.status(400).json({ message: 'Contest not found' });
        if (!problem) return res.status(400).json({ message: 'Problem not found' });

        if (new Date(contest.endDate) < new Date()) {
            return res.status(400).json({ message: 'Contest has ended', errCode: 'end01' });
        }

        // Adjust limits
        const time_limit = getLanguageTime(language_id, problem.time_limit);
        const memory_limit = problem.memory_limit * 1024;

        // Calculate total points
        const totalPoints = testCases.reduce((acc, testCase) => acc + testCase.points, 0);

        // Prepare submissions with test case IDs
        const submissions = testCases.map((testCase, index) => ({
            language_id,
            source_code: code,
            stdin: testCase.input.trim(),
            expected_output: testCase.output.trim(),
            encode: true,
            cpu_time_limit: time_limit,
            memory_limit,
            test_case_id: `#${index + 1}` // Add test case ID starting from #1
        }));

        // Submit to Judge0
        const response = await axios.post(`${JUDGE0_API}/batch`, { submissions });
        const tokens = response.data.map(token => token.token);
        const token_freq = tokens.reduce((acc, token) => {
            acc[token] = { status: -1, time: 0, memory: 0 };
            return acc;
        }, {});

        const randUid = generateUidFromTokens(tokens);

        // Save submission to DB
        const submissDb = await Submissions.create({
            userId: req.user.id,
            contestId,
            problemId,
            tokens: tokens.join(','),
            submissionUid: randUid,
        });

        if (!submissDb) return res.status(500).json({ message: 'Failed to save submission' });

        // Polling loop with optimizations
        const MAX_WAIT_TIME = 30000; // 30 seconds timeout
        const startTime = Date.now();
        let delay = 1000;
        let accCount = 0;
        let tksize = tokens.length;
        let fails = false;

        // Polling logic to fetch results
        while (tksize > 0 && Date.now() - startTime < MAX_WAIT_TIME) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * 2, 5000); // Exponential backoff

            // Fetch results for pending tokens
            const pendingTokens = Object.keys(token_freq).filter(token => token_freq[token].status === -1);
            if (pendingTokens.length === 0) break;

            const resultResponse = await axios.get(`${JUDGE0_API}/batch?tokens=${pendingTokens.join(',')}&base64_encoded=true`);
            const result = resultResponse.data.submissions;

            result.forEach(d => {
                if (d.status.id > 2 && token_freq[d.token].status === -1) {
                    token_freq[d.token] = {
                        status: d.status.id,
                        time: d.time,
                        memory: d.memory,
                    };
                    tksize--;
                    if (d.status.id === 3) accCount++;
                    else fails = true;
                }
            });

            if (fails) break;
        }

        // Update participant score if all tests passed
        if (accCount === testCases.length) {
            const transaction = await sequelize.transaction();

            try {
                const contestParticipant = await Contest_Participants.findOne({
                    where: { contestId, userId: req.user.id },
                    transaction,  // Pass transaction explicitly
                });

                if (!contestParticipant) {
                    await transaction.rollback();
                    return res.status(404).json({ message: 'Participant not found' });
                }

                contestParticipant.score += totalPoints;
                contestParticipant.last_submission_at = new Date();
                await contestParticipant.save({ transaction });  // Ensure it runs inside the transaction

                const solved = await Solved.create(
                    {
                        userId: req.user.id,
                        contestId,
                        problemId,
                    },
                    { transaction }
                );

                if (!solved) {
                    await transaction.rollback();
                    return res.status(500).json({ message: 'Failed to save submission' });
                }

                await transaction.commit();  // Ensure commit is awaited
                //return res.status(200).json({ message: 'Submission saved successfully' });

            } catch (error) {
                await transaction.rollback();
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }


        // Prepare response data
        const data = Object.fromEntries(
            Object.keys(token_freq).map(token => [
                token, {
                    status: token_freq[token].status,
                    time: token_freq[token].time,
                    memory: token_freq[token].memory,
                }
            ])
        );

        return res.status(200).json({
            isAc: accCount === testCases.length,
            submissionId: randUid,
            data,
        });

    } catch (error) {
        console.error('Error in submitProblemController:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



export { runProblemController, getProblemController, updateProblemController, submitProblemController, isSolvedQuestionController };