import Nav from "./nav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Trash2 } from "lucide-react";

interface TestCase {
    id: number;
    input: string;
    output: string;
    points: number;
}

export default function AddProblem({ props, baseUrl }: { props: any, baseUrl: string }) {

    const { name, email, image, username, isAdmin } = props.data;

    const [question, setQuestion] = useState({
        title: "",
        description: "",
        difficulty: "",
        constraints: "",
        inputFormat: "",
        outputFormat: "",
        sampleInput: "",
        sampleOutput: "",
        timeLimit: 0,
        memoryLimit: 0,
    });

    const [testCases, setTestCases] = useState<TestCase[]>([]);

    const { toast } = useToast();

    const handleSubmit = () => {
        if (testCases.length === 0) {
            toast({
                title: "Please add at least one test case",
                description: "Please add at least one test case",
            })
        }
        const questionData = {
            title: question.title,
            description: question.description,
            difficulty: question.difficulty,
            constraints: question.constraints,
            input_format: question.inputFormat,
            output_format: question.outputFormat,
            time_limit: question.timeLimit,
            memory_limit: question.memoryLimit,
            public_test_cases: {
                input: question.sampleInput,
                output: question.sampleOutput,
            },
            test_cases: testCases.map((testCase) => ({
                input: testCase.input,
                output: testCase.output,
                points: testCase.points,
            }))
        }

        console.log(questionData);

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }

        fetch(`${baseUrl}/api/admin/addProblem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(questionData),
        }).then(response => {
            if (response.ok) {
                toast({
                    title: "Problem added successfully",
                    description: "Problem added successfully",
                })
            } else {
                toast({
                    title: "Error",
                    description: "Error adding problem",
                })
            }
        }).catch(error => {
            toast({
                title: "Error",
                description: "Error adding problem",
            })
        })
    }

    function preventDefault(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    return (
        <div>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="flex px-4 py-24">
                <form onSubmit={preventDefault} className="w-full">
                    <Tabs defaultValue="info" className="space-y-4 container gap-4 items-center justify-center mx-auto">
                        <TabsList className="">
                            <TabsTrigger value="info">Question Info</TabsTrigger>
                            <TabsTrigger value="testCases">Test Cases</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Question Info</CardTitle>
                                    <CardDescription>Add the question info here</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                                        <Input type="text" id="title"
                                            value={question.title}
                                            onChange={(e) => setQuestion({ ...question, title: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                        <Textarea id="description"
                                            value={question.description}
                                            onChange={(e) => setQuestion({ ...question, description: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="constraints">Constraints <span className="text-red-500">*</span></Label>
                                        <Textarea id="constraints"
                                            value={question.constraints}
                                            onChange={(e) => setQuestion({ ...question, constraints: e.target.value })} required />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4" >
                                        <div className="space-y-2">
                                            <Label htmlFor="difficulty">Difficulty <span className="text-red-500">*</span></Label>
                                            <Select value={question.difficulty} onValueChange={(value) => setQuestion({ ...question, difficulty: value })} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem className="cursor-pointer text-green-500" value="easy">Easy</SelectItem>
                                                    <SelectItem className="cursor-pointer text-yellow-500" value="medium">Medium</SelectItem>
                                                    <SelectItem className="cursor-pointer text-red-500" value="hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Time Limit(in seconds) <span className="text-red-500">*</span></Label>
                                            <Input type="number" id="timeLimit"
                                                value={question.timeLimit}
                                                className=""
                                                min={0}
                                                onBlur={(e) => {
                                                    if (parseInt(e.target.value) < 0) {
                                                        toast({
                                                            title: "Time limit must be greater than 0",
                                                            description: "Please enter a valid time limit",
                                                        })
                                                        setQuestion({ ...question, timeLimit: 0 })
                                                    }
                                                    else {
                                                        setQuestion({ ...question, timeLimit: parseInt(e.target.value) })
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setQuestion({ ...question, timeLimit: parseInt(e.target.value) })
                                                }

                                                } required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Memory Limit(in MB) <span className="text-red-500">*</span></Label>
                                            <Input type="number" id="memoryLimit"
                                                value={question.memoryLimit}
                                                min={100}
                                                onBlur={(e) => {
                                                    if (parseInt(e.target.value) < 100) {
                                                        toast({
                                                            title: "Memory limit must be greater than 100",
                                                        })
                                                        setQuestion({ ...question, memoryLimit: 100 })
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setQuestion({ ...question, memoryLimit: parseInt(e.target.value) })
                                                }
                                                }
                                                required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4" >
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Input Format <span className="text-red-500">*</span></Label>
                                            <Textarea id="inputFormat"
                                                value={question.inputFormat}
                                                onChange={(e) => setQuestion({ ...question, inputFormat: e.target.value })}
                                                required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Output Format <span className="text-red-500">*</span></Label>
                                            <Textarea id="outputFormat"
                                                value={question.outputFormat}
                                                onChange={(e) => setQuestion({ ...question, outputFormat: e.target.value })}
                                                required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Sample Input <span className="text-red-500">*</span></Label>
                                            <Textarea id="sampleInput"
                                                value={question.sampleInput}
                                                onChange={(e) => setQuestion({ ...question, sampleInput: e.target.value })}
                                                required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Sample Output <span className="text-red-500">*</span></Label>
                                            <Textarea id="sampleOutput"
                                                value={question.sampleOutput}
                                                onChange={(e) => setQuestion({ ...question, sampleOutput: e.target.value })}
                                                required />

                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="testCases">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <div className="flex justify-between items-center">
                                            <span>Test Cases</span>
                                            <Button onClick={() => {
                                                if (testCases.length === 0) {
                                                    setTestCases([{
                                                        id: 1,
                                                        input: "",
                                                        output: "",
                                                        points: 0
                                                    }])
                                                }
                                                else {
                                                    setTestCases([...testCases, {
                                                        id: testCases.length + 1,
                                                        input: "",
                                                        output: "",
                                                        points: 0
                                                    }])
                                                }
                                                console.log(testCases)
                                            }}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardTitle>

                                </CardHeader>
                                <CardContent>
                                    {testCases.length > 0 && testCases.map((testCase, index) => (
                                        <Card key={index} className="mb-4">
                                            <CardHeader>
                                                <CardTitle>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold">Test Case {index + 1}</span>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newTestCases = [...testCases];
                                                                newTestCases.splice(index, 1);
                                                                setTestCases(newTestCases);
                                                            }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex justify-between gap-4">
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <Label htmlFor={`input-${index}`}>Input</Label>
                                                        <Textarea id={`input-${index}`} value={testCase.input} onChange={(e) => {
                                                            const newTestCases = [...testCases];
                                                            newTestCases[index].input = e.target.value;
                                                            setTestCases(newTestCases);
                                                        }} />
                                                    </div>
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <Label htmlFor={`output-${index}`}>Output</Label>
                                                        <Textarea id={`output-${index}`} value={testCase.output} onChange={(e) => {
                                                            const newTestCases = [...testCases];
                                                            newTestCases[index].output = e.target.value;
                                                            setTestCases(newTestCases);
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between gap-4 mt-4">
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <Label htmlFor={`points-${index}`}>Points</Label>
                                                        <Input type="number" id={`points-${index}`} value={testCase.points} onChange={(e) => {
                                                            const newTestCases = [...testCases];
                                                            newTestCases[index].points = parseInt(e.target.value);
                                                            setTestCases(newTestCases);
                                                        }} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </div>
    )
}