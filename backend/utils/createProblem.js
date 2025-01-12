import { Problems, TestCases } from "../models/index.js";

const saveQuestionsToDatabase = async (questions) => {
    try {
        for (const question of questions) {
            // Save the problem details
            const problem = await Problems.create({
                title: question.title,
                description: question.description,
                difficulty: question.difficulty,
                input_format: question.input_format,
                output_format: question.output_format,
                constraints: question.constraints.join("\n"),
                time_limit: question.time_limit,
                memory_limit: question.memory_limit,
            });

            // Save the test cases
            for (const testCase of question.testCases) {
                await TestCases.create({
                    problemId: problem.id,
                    input: testCase.input,
                    output: testCase.output,
                    isPublic: testCase.isPublic,
                    points: testCase.points,
                });
            }

            console.log(`Question "${question.title}" and its test cases saved successfully.`);
        }
    } catch (error) {
        console.error("Error saving questions to the database:", error.message);
    }
};

// Basic 10 questions template
const questions = [
    {
        title: "Palindrome Checker",
        description: "Check if a given string is a palindrome.",
        difficulty: "easy",
        input_format: "A single string s.",
        output_format: "Return 'true' if s is a palindrome, otherwise 'false'.",
        constraints: ["1 <= s.length <= 100", "s consists of lowercase English letters."],
        time_limit: 1000,
        memory_limit: 512,
        testCases: [
            { input: "racecar", output: "true", isPublic: true, points: 10 },
            { input: "hello", output: "false", isPublic: true, points: 10 },
        ],
    },
    {
        title: "Fibonacci Sequence",
        description: "Generate the first n numbers of the Fibonacci sequence.",
        difficulty: "easy",
        input_format: "An integer n.",
        output_format: "An array of the first n Fibonacci numbers.",
        constraints: ["1 <= n <= 50"],
        time_limit: 1000,
        memory_limit: 512,
        testCases: [
            { input: "5", output: "[0, 1, 1, 2, 3]", isPublic: true, points: 10 },
            { input: "10", output: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]", isPublic: true, points: 10 },
        ],
    },
    {
        title: "Sum of Array",
        description: "Find the sum of all elements in an array.",
        difficulty: "easy",
        input_format: "An array of integers nums.",
        output_format: "An integer representing the sum of nums.",
        constraints: ["1 <= nums.length <= 100", "-1000 <= nums[i] <= 1000"],
        time_limit: 1000,
        memory_limit: 512,
        testCases: [
            { input: "[1, 2, 3, 4, 5]", output: "15", isPublic: true, points: 10 },
            { input: "[-1, -2, -3, 4, 5]", output: "3", isPublic: true, points: 10 },
        ],
    },
    {
        title: "Prime Number Check",
        description: "Determine whether a number is prime.",
        difficulty: "easy",
        input_format: "An integer n.",
        output_format: "Return 'true' if n is a prime number, otherwise 'false'.",
        constraints: ["1 <= n <= 10^6"],
        time_limit: 1000,
        memory_limit: 512,
        testCases: [
            { input: "7", output: "true", isPublic: true, points: 10 },
            { input: "10", output: "false", isPublic: true, points: 10 },
        ],
    },
    {
        title: "Find Largest Number",
        description: "Find the largest number in an array.",
        difficulty: "easy",
        input_format: "An array of integers nums.",
        output_format: "An integer representing the largest number in nums.",
        constraints: ["1 <= nums.length <= 100", "-1000 <= nums[i] <= 1000"],
        time_limit: 1000,
        memory_limit: 512,
        testCases: [
            { input: "[1, 3, 5, 7, 9]", output: "9", isPublic: true, points: 10 },
            { input: "[-10, -5, 0, 5, 10]", output: "10", isPublic: true, points: 10 },
        ],
    },
    // Add 5 more questions with similar structure
];

// Save the questions to the database
saveQuestionsToDatabase(questions);
