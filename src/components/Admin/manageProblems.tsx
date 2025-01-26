import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Nav from "./nav";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { toast, useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Toaster } from "../ui/toaster";
import { useState, useEffect } from "react";
import { Pencil, RefreshCw, Trash } from "lucide-react";
interface Problem {
    id: number;
    name: string;
    difficulty: string;
    createdAt: string;
}

export default function ManageProblemsPage({ props, baseUrl }: { props: any, baseUrl : string }) {


    const { name, email, image, username, isAdmin } = props.data;
    const { toast } = useToast();

    const [problems, setProblems] = useState<Problem[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    function fetchProblems() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        fetch(`${baseUrl}/api/admin/problemList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                rangeStart: 0,
                rangeEnd: 100
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 403) {
                    toast({
                        title: "Error",
                        description: "You are not authorized to access this resource",
                        variant: "destructive",
                        duration: 3000,
                    })
                }
                throw new Error("Failed to fetch problems");
            })
            .then(data => setProblems(data))
            .catch(error => {
                console.log(error);

                toast({
                    title: "Error",
                    description: "Error fetching problems",
                    variant: "destructive",
                    duration: 3000,
                })

            });
    }

    const handleDeleteProblem = (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        fetch(`${baseUrl}/api/admin/deleteProblem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
        })
            .then(response => {
                toast({
                    title: "Success",
                    description: "Problem deleted successfully",
                    variant: "default",
                    duration: 3000,
                })
                window.location.reload();

            })
            .catch(error => {
                toast({
                    title: "Error",
                    description: "Error deleting problem",
                    variant: "destructive",
                    duration: 3000,
                })
            })
    }

    useEffect(() => {
        fetchProblems();
    }, []);

    const [search, setSearch] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleRefresh = () => {
        setProblems([]);
        setSearch("");
        fetchProblems();
    }

    const handleAddProblem = () => {
        window.location.href = "/admin/addProblem";
    }

    const handleEditProblem = (id: number) => {
        window.location.href = `/admin/editProblem?id=${id}`;
    }

    return (
        <div>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="flex px-4 py-24">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Manage Problems</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-end">
                            <Input placeholder="Search problems" value={search} onChange={handleSearch} />
                            <Button className="ml-2" onClick={handleAddProblem}>Add Problem</Button>
                            <Button className="ml-2" onClick={handleRefresh}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="w-full h-px bg-gray-300 my-4"></div>
                        <div className="flex justify-between items-center">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Name
                                        </TableHead>
                                        <TableHead>
                                            Difficulty
                                        </TableHead>
                                        <TableHead>
                                            Created At
                                        </TableHead>
                                        <TableHead>
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {problems
                                        .filter(problem => 
                                            problem.name.toLowerCase().includes(search.toLowerCase()) ||
                                            problem.difficulty.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map(problem => (
                                            <TableRow key={problem.id}>
                                                <TableCell>{problem.name}</TableCell>
                                                <TableCell>{problem.difficulty}</TableCell>
                                                <TableCell>{problem.createdAt}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleEditProblem(problem.id)}
                                                        >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteProblem(problem.id)}
                                                        variant="destructive" className="ml-2">
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

