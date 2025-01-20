import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import Nav from "./nav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface TestCase {
    id: number;
    input: string;
    output: string;
    isPublic: boolean;
    points: number;
}

export default function EditProblemPage({ props }: { props: any }) {
    const { name, email, image, username, isAdmin } = props.data;
    const { toast } = useToast();
    

    const [question, setQuestion] = useState({
        title: "",
        description: "",
        difficulty: "",
        constraints: "",
        input_format: "",
        output_format: "",
        sample_input: "",
        sample_output: "",
        time_limit: 0,
        memory_limit: 0,
    });
    const [testCases, setTestCases] = useState<TestCase[]>([]);
  


    function preventDefault(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

    useEffect(() => {
        console.log(props)
        const question = props.question;
        setQuestion(question);
        const testCases = props.testCases;
        setTestCases(testCases);

        for (const testCase of testCases) {
            if (testCase.isPublic) {
                question.sample_input = testCase.input;
                question.sample_output = testCase.output;
                testCases.splice(testCases.indexOf(testCase), 1);
            }
        }
        setTestCases(testCases);
    }, []);

 

    function handleSubmit() {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
        }
        const id = props.id;
        if (!id) {
            toast({
                title: "Error updating question",
                description: "Please try again",
            })
            return;
        }

        testCases.push({
            id: testCases.length + 1,
            input: question.sample_input,
            output: question.sample_output,
            isPublic: true,
            points: 0
        });

    

        fetch(`http://localhost:5000/api/problems/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ question, testCases})
        }).then((res) => {
            if (res.ok) {
                toast({
                    title: "Question updated successfully",
                    description: "Your question has been updated successfully",
                })
                window.location.href = "/admin/manageProblems";
            }
            else {
                toast({
                    title: "Error updating question",
                    description: "Please try again",
                })
            }
        }).catch((err) => {
            toast({
                title: "Error updating question",
                description: "Please try again",
            })
        })
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
                                            <Input type="number" id="time_limit"
                                                value={question.time_limit}
                                                className=""
                                                min={0}
                                                onBlur={(e) => {
                                                    if (parseInt(e.target.value) < 0) {
                                                        toast({
                                                            title: "Time limit must be greater than 0",
                                                            description: "Please enter a valid time limit",
                                                        })
                                                        setQuestion({ ...question, time_limit: 0 })
                                                    }
                                                    else {
                                                        setQuestion({ ...question, time_limit: parseInt(e.target.value) })
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setQuestion({ ...question, time_limit: parseInt(e.target.value) })
                                                }

                                                } required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Memory Limit(in MB) <span className="text-red-500">*</span></Label>
                                            <Input type="number" id="memory_limit"
                                                value={question.memory_limit}
                                                min={100}
                                                onBlur={(e) => {
                                                    if (parseInt(e.target.value) < 100) {
                                                        toast({
                                                            title: "Memory limit must be greater than 100",
                                                        })
                                                        setQuestion({ ...question, memory_limit: 100 })
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setQuestion({ ...question, memory_limit: parseInt(e.target.value) })
                                                }
                                                }
                                                required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4" >
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Input Format <span className="text-red-500">*</span></Label>
                                            <Textarea id="input_format"
                                                value={question.input_format}
                                                onChange={(e) => setQuestion({ ...question, input_format: e.target.value })}
                                                required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Output Format <span className="text-red-500">*</span></Label>
                                            <Textarea id="output_format"
                                                value={question.output_format}
                                                onChange={(e) => setQuestion({ ...question, output_format: e.target.value })}
                                                required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Sample Input <span className="text-red-500">*</span></Label>
                                            <Textarea id="sample_input"
                                                value={question.sample_input}
                                                onChange={(e) => setQuestion({ ...question, sample_input: e.target.value })}
                                                required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="constraints">Sample Output <span className="text-red-500">*</span></Label>
                                            <Textarea id="sample_output"
                                                value={question.sample_output}
                                                onChange={(e) => setQuestion({ ...question, sample_output: e.target.value })}
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
                                                        isPublic: false,
                                                        points: 0
                                                    }])
                                                }
                                                else {
                                                    setTestCases([...testCases, {
                                                        id: testCases.length + 1,
                                                        input: "",
                                                        output: "",
                                                        isPublic: false,
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
                                                                // add the test case to the deleted test cases array
                                                                
                                                                newTestCases.splice(index, 1); // remove the test case from the array
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
