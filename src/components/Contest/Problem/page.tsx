import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import Nav from './nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertCircleIcon, Car, Copy, TriangleAlert } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Problem {
    id: number;
    title: string;
    description: string;
    constraints: string[];
    testCases: {
        input: string;
        output: string;
    } | {
        input: string;
        output: string;
    }[];
    input_format: string;
    output_format: string;
    hint: string;
}

interface TestCase {
    status: number;
    time: string;
    memory: number;
}

interface SubmissionData {
    [key: string]: TestCase;
}
interface FinalSubmission {
    isAc: boolean;
    submissionId: string;
    data: SubmissionData;
}

export default function ProblemPage(props: {
    name: string,
    email: string,
    image: string,
    username: string
    , problems: Problem[]
    , baseUrl: string
}) {

    const [questions, setQuestions] = useState<Problem[]>(props.problems)
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [username, setUsername] = useState<string>("")


    useEffect(() => {
        setName(props.name)
        setEmail(props.email)
        setImage(props.image)
        setUsername(props.username)

    }, [])


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const contestId = window.location.pathname.split('/')[2]
                const response = await fetch(`${props.baseUrl}/api/contest/problems`,
                    {
                        'method': 'POST',
                        'headers': {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        'body': JSON.stringify({ contestId })
                    }).then(async res => {
                        const data = await res.json()
                        setName(data.name)
                        setEmail(data.email)
                        setImage(data.image)
                        setUsername(data.username)
                        setQuestions(data.problems)
                    }).catch(err => {
                        const errCode = err.errCode
                        if (errCode === 'end01') {
                            window.location.href = '/contest/' + contestId + '/leaderboard'
                        } else if (errCode === 'notstart') {
                            window.location.href = '/dashboard'
                        }
                        console.error(err)
                    })
            } catch (error) {
                console.error(error)
            }
        }

        fetchQuestions()

        var intervalId = setInterval(fetchQuestions, 10000);

        return () => clearInterval(intervalId)
    }, []);




    const languages = [
        { value: "c", label: "C", language_id: 50 },
        { value: "cpp", label: "C++", language_id: 54 },
        { value: "java", label: "Java", language_id: 62 }
    ]
    const starterCode = {
        cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n\t// Write your solution here\n\treturn 0;\n}`,
        java: `class Main {\n\tpublic static void main(String[] args) {\n\t\t// Write your solution here\n\t}\n}`,
        c: `#include <stdio.h>\n\nint main() {\n\t// Write your solution here\n\treturn 0;\n}`
    }
    const [code, setCode] = useState<string>("")
    const [language, setLanguage] = useState<string>("c")
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string[]>([])
    const [expectedOutput, setExpectedOutput] = useState<string>('')
    const [actualOutput, setActualOutput] = useState<string>('')
    const [compileOutput, setCompileOutput] = useState<string>('')

    const [submission, setSubmission] = useState<string>("")
    const [iFinalSubmission, setIFinalSubmission] = useState<FinalSubmission>()

    const [currentTheme, setCurrentTheme] = useState<string>("vs-dark")
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const enterFullscreen = () => {
        const element = document.documentElement; // Get the root element
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
            (element as any).webkitRequestFullscreen(); // For Chrome, Safari, and Opera
        }
    };

    useEffect(() => {

        // fullscreen change listener
        const fullscreenChange = () => {
            if (document.fullscreenElement) {
                setFullscreen(true);
            } else {
                setFullscreen(false);
            }
        };

        document.addEventListener('fullscreenchange', fullscreenChange);
    }, [])

    const handleFullscreen = () => {
        if (fullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen(); // For Chrome, Safari and Opera
            }
            setFullscreen(false);
        } else {
            enterFullscreen();
        }
    };



    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true'
        setIsDarkMode(darkMode)
        setCurrentTheme(darkMode ? 'vs-dark' : 'vs-light')

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const darkMode = document.documentElement.classList.contains('dark');
                    setIsDarkMode(darkMode);
                    setCurrentTheme(darkMode ? 'vs-dark' : 'vs-light');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
        });

        return () => observer.disconnect();



    }, [])

    const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [savedCodes, setSavedCodes] = useState<{ [key: number]: { [key: string]: string } }>({})

    useEffect(() => {
        const initialSavedCodes = questions.reduce((acc, question) => {
            acc[question.id] = languages.reduce((langAcc, lang) => {
                langAcc[lang.value] = starterCode[lang.value as keyof typeof starterCode]
                return langAcc
            }, {} as { [key: string]: string })
            return acc
        }, {} as { [key: number]: { [key: string]: string } })
        setSavedCodes(initialSavedCodes)
    }, [])

    const currentQuestionIdx = questions[currentQuestion]
    const currentCode = savedCodes[currentQuestionIdx.id]?.[language] || starterCode[language as keyof typeof starterCode]

    useEffect(() => {
        if (Array.isArray(currentQuestionIdx.testCases)) {
            setInput(currentQuestionIdx.testCases.map(tc => tc.input).join('\n'))
            setOutput(currentQuestionIdx.testCases.map(tc => tc.output).join('\n'))
        } else {
            setInput(currentQuestionIdx.testCases.input)
            setOutput(currentQuestionIdx.testCases.output)
        }
        setCode(starterCode[language as keyof typeof starterCode])
    })


    const handleEditorChange = (value: string | undefined) => {
        if (value) {
            setSavedCodes(prevCode => ({
                ...prevCode,
                [currentQuestionIdx.id]: {
                    ...prevCode[currentQuestionIdx.id],
                    [language]: value
                }
            }))
            setCode(value)
        }
    }



    const handleLanguageChange = (value: string) => {
        setLanguage(value)
    }

    const handleEditorValidation = (markers: any[]) => {
        const errors = markers.filter(marker => marker.severity === 8).map(marker => marker.message)
        setError(errors)
    }
    const getReversedData = () => {

        return Object.entries(iFinalSubmission?.data || {}); // Return original order if no AC
    };
    const handleRunCode = async () => {
        // Clear previous output
        setOutput("")
        setError([])
        setSubmission("")
        setLoading(true)

        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }



        const response = await fetch(`${props.baseUrl}/api/problems/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                problemId: currentQuestionIdx.id,
                contestId: window.location.pathname.split('/')[2],
                language_id: languages.find(lang => lang.value === language)?.language_id,
                code: currentCode,
                stdin: input
            })
        })

        if (response.ok) {
            const data = await response.json()

            const { message } = data;
            setSubmission(message)
            if (message == "Compilation Error") {
                const { compile_output } = data;
                const decoded = atob(compile_output).replace(/â/g, '').replace(/â/g, '');
                setCompileOutput(decoded);
            } else if (message == "Wrong Answer") {
                const { expected_output, stdout } = data;
                setExpectedOutput(expected_output);
                if (stdout === null) {
                    setActualOutput("Nothing was printed to the console");
                } else {
                    const decoded = atob(stdout).replace(/â/g, '').replace(/â/g, '');
                    setActualOutput(decoded);
                }
            } else if (message.includes("Runtime Error")) {
                const { stderr } = data;
                const decoded = atob(stderr).replace(/â/g, '').replace(/â/g, '');
                setCompileOutput(decoded);
            }

        } else {
            const data = await response.json()
            if (data.errCode = "end01") {
                window.location.href = '/contest/' + window.location.pathname.split('/')[2] + '/leaderboard'
            } else {
                setError([data.message])
            }
        }

        setLoading(false)
    }

    const handleSubmitCode = async () => {
        // Clear previous output
        setOutput("")
        setError([])
        setSubmission("")
        setIFinalSubmission(undefined)
        setLoading(true)

        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }

        await fetch(`${props.baseUrl}/api/problems/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                problemId: currentQuestionIdx.id,
                contestId: window.location.pathname.split('/')[2],
                language_id: languages.find(lang => lang.value === language)?.language_id,
                code: currentCode
            })
        }).then(async res => {
            let data = await res.json();
            if (res.ok) {
                // Convert the data object to an array of entries for easier manipulation
                let entries = Object.entries(data.data) as [string, TestCase][];

                // Find the index where status is 3
                let reverseIndex = entries.findIndex(([key, value]) => value.status === 3);

                if (reverseIndex !== -1) {
                    // Reverse the part of the array from index 0 to reverseIndex (inclusive)
                    let reversedPart = entries.slice(0, reverseIndex + 1).reverse();

                    // Combine the reversed part with the remaining entries
                    let result = [...reversedPart, ...entries.slice(reverseIndex + 1)];

                    // Convert the result back to an object
                    let reversedData = Object.fromEntries(result);

                    // Set the state with the reversed data
                    setIFinalSubmission({ ...data, data: reversedData });
                } else {
                    // If no entry with status 3 is found, set the data as is
                    setIFinalSubmission(data);
                }
            } else {
                setError([data.message]);
            }
        }).catch(err => {
            console.error(err)
        })

        setLoading(false)
    }

    const handleResetCode = () => {
        handleEditorChange(starterCode[language as keyof typeof starterCode])
        setOutput("")
        setError([])
        setSubmission("")
    }
    const handleQuestionChange = (idx: number) => {
        setCurrentQuestion(idx)
        if (Array.isArray(questions[idx].testCases)) {
            setInput(questions[idx].testCases.map(tc => tc.input).join('\n'))
        }
        else {
            setInput(questions[idx].testCases.input)
        }

        setCode(savedCodes[questions[idx].id]?.[language] || starterCode[language as keyof typeof starterCode])
        setError([])

    }


    return (
        <>
            {!fullscreen && (
                // Can't switch to other tabs or full screen mode warning
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
                    <div className='container mx-auto px-4 py-24'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center' >
                                    <AlertCircleIcon className='h-8 w-8 text-red-500' />
                                    <span className='ml-2'>Important Notice</span>
                                </CardTitle>
                                <CardDescription>
                                    Test is started can be accessed only in full screen mode. Please click on the button below to enter full screen mode.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='flex flex-col space-y-4' >
                                <ul className='list-disc pl-5 space-y-2'>
                                    <li>Do not switch to other tabs during the test</li>
                                    <li>Do not exit full screen mode</li>
                                    <li>Do not refresh the page</li>
                                </ul>
                                <div className='flex justify-center items-center' >

                                    <TriangleAlert className='h-8 w-8 text-red-500' />
                                    <span className='ml-2'>Warning</span>
                                    &nbsp;:
                                    Leaving test leads to &nbsp;<span className='text-red-500 font-bold'>disqualification.</span>
                                </div>
                                <Button onClick={handleFullscreen} >Enter Full Screen Mode</Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            )}
            {fullscreen && (

                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
                    <Nav name={name} email={email} image={image} username={username} />
                    <div className='mx-auto py-24 px-4 h-[calc(100vh-4rem)]'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 h-full '>
                            <div className='lg:col-span-1 space-y-3 overflow-y-auto no-scrollbar' >
                                <Card >
                                    <CardHeader>
                                        <CardTitle>Question Navigation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='flex flex-wrap gap-2' >
                                            {questions.map((q, index) => (
                                                <Button
                                                    key={q.id}
                                                    variant={index === currentQuestion ? 'default' : 'outline'}
                                                    onClick={() => handleQuestionChange(index)}
                                                >
                                                    Q{index + 1}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{currentQuestionIdx.title}</CardTitle>
                                        <CardDescription>Question Description</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{currentQuestionIdx.description}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Input Format</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{currentQuestionIdx.input_format}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Output Format</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{currentQuestionIdx.output_format}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Constraints</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className='list-disc pl-5 space-y-2'>
                                            {currentQuestionIdx.constraints.map((constraint, index) => (
                                                <li key={index}>{constraint}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Test Cases</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='grid grid-cols-2 divide-x divide-border' >
                                            <div className='pr-4'>
                                                <div className='flex items-center justify-between mb-2' >
                                                    <span className='font-medium text-sm'>Input</span>
                                                    <Button variant="ghost" size="icon" className='h-6 w-6'
                                                        onClick={() => {
                                                            const input = Array.isArray(currentQuestionIdx.testCases)
                                                                ? currentQuestionIdx.testCases.map(tc => tc.input).join('\n')
                                                                : currentQuestionIdx.testCases.input;
                                                            navigator.clipboard.writeText(input);
                                                        }}>
                                                        <Copy className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                                <pre className='p-4 bg-secondary rounded-sm text-sm overflow-scroll'>
                                                    {Array.isArray(currentQuestionIdx.testCases)
                                                        ? currentQuestionIdx.testCases.map(tc => tc.input).join('\n')
                                                        : currentQuestionIdx.testCases.input}
                                                </pre>
                                            </div>
                                            <div className='pl-4'>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <span className="font-medium text-sm">Output</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className='h-6 w-6'
                                                        onClick={() => {
                                                            const output = Array.isArray(currentQuestionIdx.testCases)
                                                                ? currentQuestionIdx.testCases.map(tc => tc.output).join('\n')
                                                                : currentQuestionIdx.testCases.output;
                                                            navigator.clipboard.writeText(output);
                                                        }
                                                        }>
                                                        <Copy className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                                <pre className='p-4 bg-secondary rounded-sm text-sm overflow-scroll '>
                                                    {Array.isArray(currentQuestionIdx.testCases)
                                                        ? currentQuestionIdx.testCases.map(tc => tc.output).join('\n')
                                                        : currentQuestionIdx.testCases.output}
                                                </pre>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Right Side */}
                            <div className='lg:col-span-2 space-y-4 max-lg:pt-4 overflow-y-auto h-[calc(100vh-6rem)] no-scrollbar '>
                                <div className='flex justify-between items-center sticky top-0 z-[9] bg-gray-100 dark:bg-gray-900 px-4 py-2' >
                                    <Select value={language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className='w-[180px]' >
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map(lang => (
                                                <SelectItem key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
                                    <div className='flex gap-4' >
                                        <Button
                                            disabled={loading}
                                            onClick={handleRunCode} >Run Code</Button>
                                        <Button
                                            disabled={loading}
                                            onClick={handleSubmitCode} >Submit Code</Button>
                                        <Button variant="destructive" onClick={handleResetCode}>Reset Code</Button>
                                    </div>
                                </div>
                                <Card className='min-h-[400px]' >
                                    <CardContent className='p-0' >
                                        <Editor
                                            height="400px"
                                            language={language}
                                            value={currentCode}
                                            onChange={handleEditorChange}
                                            onValidate={handleEditorValidation}
                                            theme={currentTheme}
                                            options={{
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                tabSize: 4,
                                                scrollBeyondLastLine: false,
                                                insertSpaces: true,
                                                // Disable command f1

                                                autoIndent: 'full',
                                                scrollbar: {
                                                    alwaysConsumeMouseWheel: false
                                                }
                                            }}
                                        />
                                    </CardContent>
                                    {/* {error.length > 0 && (
                                        <Alert variant="destructive">
                                            <AlertCircle className='h-4 w-4' />
                                            <AlertTitle>Syntax Errors</AlertTitle>
                                            <AlertDescription>
                                                <ul className='list-disc pl-5'>
                                                    {error.map((err, index) => (
                                                        <li key={index}>{err}</li>
                                                    ))}
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    )} */}
                                    {/* { success.length > 0 && (
                                        <Alert variant="default">
                                            <AlertCircle className='h-4 w-4' />
                                            <AlertTitle>Success</AlertTitle>
                                            <AlertDescription>
                                                {success}
                                            </AlertDescription>
                                        </Alert>
                                    )} */}
                                </Card>

                                <div className='gap-4' >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Submission Output</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {submission ? (
                                                <div>
                                                    <div className={`p-4 rounded-md text-center font-bold ${submission === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                        submission === 'Time Limit Exceeded' ? 'bg-yellow-100 text-yellow-800' :
                                                            submission === 'Runtime Error' ? 'bg-red-100 text-red-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {submission}
                                                    </div>
                                                    {submission === 'Wrong Answer' && expectedOutput && actualOutput && (
                                                        <div className="mt-4 space-y-2">
                                                            <div>
                                                                <h4 className="font-semibold">Expected Output:</h4>
                                                                <pre className="bg-gray-100 p-2 rounded text-gray-800 dark-text-gray-200 overflow-scroll
                                                                ">{expectedOutput}</pre>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">Your Output:</h4>
                                                                <pre className="bg-gray-100 p-2 rounded text-gray-800 dark-text-gray-200 overflow-scroll">{actualOutput}</pre>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {submission === 'Compilation Error' && compileOutput && (
                                                        <div className="mt-4">
                                                            <h4 className="font-semibold">Compile Output:</h4>
                                                            <pre className="bg-gray-100 p-2 rounded text-gray-800 dark-text-gray-200 overflow-scroll">{compileOutput}</pre>
                                                        </div>
                                                    )}
                                                    {submission.includes("Runtime Error")
                                                        && compileOutput && (
                                                            <div className="mt-4">
                                                                <h4 className="font-semibold">Runtime Error:</h4>
                                                                <pre className="bg-gray-100 p-2 rounded text-gray-800 dark-text-gray-200 overflow-scroll">{compileOutput}</pre>
                                                            </div>
                                                        )}
                                                </div>
                                            )
                                                : ( !submission && error.length > 0 && iFinalSubmission &&
                                                    (
                                                    <div className="text-center text-gray-500">No submission yet</div>
                                                    )
                                                )}

                                            {loading && (
                                                <div className="flex justify-center items-center mt-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                                </div>
                                            )}
                                            {(iFinalSubmission && !iFinalSubmission.isAc) ? (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold">Test Cases:</h4>
                                                    <div className="overflow-scroll">
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border border-gray-300 dark:border-gray-700">Test Case</th>
                                                                    <th className="border border-gray-300 dark:border-gray-700">Status</th>
                                                                    <th className="border border-gray-300 dark:border-gray-700">Time</th>
                                                                    <th className="border border-gray-300 dark:border-gray-700">Memory</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {getReversedData().map(([tcId, tc], index) => (
                                                                    <tr key={index}>
                                                                        <td className="border border-gray-300 dark:border-gray-700">#{index + 1}</td>
                                                                        <td className="border border-gray-300 dark:border-gray-700">{(
                                                                            tc.status === 3 ? 'Accepted' :
                                                                                tc.status === 4 ? 'Wrong Answer' :
                                                                                    tc.status === 5 ? 'Time Limit Exceeded' :
                                                                                        tc.status === 6 ? 'Compilation Error' :
                                                                                            tc.status === 7 ? 'Runtime Error' :
                                                                                                tc.status === 8 ? 'Compilation Error' :
                                                                                                    tc.status === -1 ? 'Not Processed' :
                                                                                                        'Compilation Error'
                                                                        )}</td>
                                                                        <td className="border border-gray-300 dark:border-gray-700">{tc.time} ms</td>
                                                                        <td className="border border-gray-300 dark:border-gray-700">{tc.memory} KB</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ) : (iFinalSubmission && iFinalSubmission.isAc) ? (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold">All TC Passed REP++</h4>
                                                </div>
                                            ) : null}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="bg-white dark:bg-gray-800 py-8  mt-24">
                        <div className="container mx-auto px-4">
                            <div className="text-center text-gray-600 dark:text-gray-300">
                                &copy; 2024 CodeContest Pro. All rights reserved.
                            </div>
                        </div>
                    </footer>
                </div>
            )}
        </>
    )

}