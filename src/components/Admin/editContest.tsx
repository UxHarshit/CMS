import Nav from "./nav";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Building2, Check, Edit2, RefreshCcw, Save, SaveIcon, SearchIcon, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface Problem {
    id: string;
    title: string;
    difficulty: string;
}


interface ContestData {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    institution: string;
    code: string;
    problems: Problem[];
}

interface Institution {
    id: string;
    name: string;
    code: string;
}


export default function EditContest({ props, baseUrl }: { props: any, baseUrl: string }) {
    const { toast } = useToast();
    const { name, email, image, username, isAdmin } = props.data;

    const [contestData, setContestData] = useState<ContestData>(props.contestData);



    const [institutions, setInstitutions] = useState<Institution[]>([]);

    const [searchInstitution, setSearchInstitution] = useState("");
    const [problemName, setProblemName] = useState("");

    const handleInstitutionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInstitution(e.target.value);
    }

    const fetchInstitutions = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        fetch(`${baseUrl}/api/admin/getInstitutions`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setInstitutions(data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchInstitutions();
    }, [])

    const [loading, setLoading] = useState(false);

    function fetchContestData() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        fetch(`${baseUrl}/api/admin/getContestData`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "contestId": contestData.id
                }
            )
        })
            .then(res => res.json())
            .then(data => {
                setContestData(data);
            })
            .catch(err => console.log(err));
    }

    const refresh = () => {
        setLoading(true);
        fetchContestData();
        toast({
            title: "Refreshed",
            description: "Contest refreshed successfully",
            variant: "default",
            duration: 3000
        })
        setLoading(false);
    }
    useEffect(() => {
        fetchContestData();
    }, [])

    const saveChanges = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }

        // convert local time to UTC
        const startDate = new Date(contestData.startDate);
        const endDate = new Date(contestData.endDate);

        console.log(startDate.toISOString());

        await fetch(`${baseUrl}/api/admin/updateContest`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "id": contestData.id,
                    "name": contestData.name,
                    "description": contestData.description,
                    "startDate": startDate.toISOString(),
                    "endDate": endDate.toISOString()
                }
            )
        }).then(res => {
            if (res.ok) {
                toast({
                    title: "Contest Updated",
                    description: "Contest updated successfully",
                    variant: "default",
                    duration: 3000
                })
            } else {
                toast({
                    title: "Error",
                    description: "Failed to update contest",
                    variant: "destructive",
                    duration: 3000
                })
            }
        })
            .catch(err => {
                toast({
                    title: "Error",
                    description: "Failed to update contest",
                    variant: "destructive",
                    duration: 3000
                })
            })
        fetchContestData();
        setLoading(false);

    }


    function getLocalTime(date: string) {
        const d = new Date(date);
        const offset = d.getTimezoneOffset();
        d.setMinutes(d.getMinutes() - offset);
        return d.toISOString().slice(0, 16);
    }

    const handleChangeInsitution = async (name: string, code: string) => {

        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        await fetch(`${baseUrl}/api/admin/changeInstitution`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "contestId": contestData.id,
                    "institutionCode": code
                }
            )
        })
            .then(res => res.json())
            .then(data => {
                {
                    toast({
                        title: "Institution Changed",
                        description: "Institution changed successfully",
                        variant: "default",
                        duration: 3000
                    })
                }
            })
            .catch(err => {
                toast({
                    title: "Error",
                    description: "Failed to change institution",
                    variant: "destructive",
                    duration: 3000
                })
            })

        setContestData({ ...contestData, institution: name, code: code });
        fetchContestData();
        setLoading(false);
    }

    const deleteProblem = async (problemId: string) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        await fetch(`${baseUrl}/api/admin/deleteContestProblem`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "contestId": contestData.id,
                    "problemId": problemId
                }
            )
        })
            .then(res => {
                if (res.ok) {
                    toast({
                        title: "Problem Deleted",
                        description: "Problem deleted successfully",
                        variant: "default",
                        duration: 3000
                    })
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to delete problem",
                        variant: "destructive",
                        duration: 3000
                    })
                }
            })
            .catch(err => {
                toast({
                    title: "Error",
                    description: "Failed to delete problem",
                    variant: "destructive",
                    duration: 3000
                })
            })

        fetchContestData();
        setLoading(false);
    }

    const [problemId, setProblemId] = useState("");
    const [problemLoading, setProblemLoading] = useState(false);

    const searchProblem = async () => {
        setProblemLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        await fetch(`${baseUrl}/api/admin/searchProblem`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "problemId": problemId
                }
            )
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setProblemName(data.title);

                    toast({
                        title: "Problem Found",
                        description: "Problem found successfully",
                        variant: "default",
                        duration: 3000
                    })
                } else {
                    toast({
                        title: "Error",
                        description: "Invalid Problem ID",
                        variant: "destructive",
                        duration: 3000
                    })
                }
            })
            .catch(err => {
                toast({
                    title: "Error",
                    description: "Failed to search problem",
                    variant: "destructive",
                    duration: 3000
                })
            })
        setProblemLoading(false);
    }

    const addProblem = async () => {
        setProblemLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        await fetch(`${baseUrl}/api/admin/addProblemToContest`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "contestId": contestData.id,
                    "problemId": problemId
                }
            )
        })
            .then(async (res) => {
                if (res.ok) {
                    toast({
                        title: "Problem Added",
                        description: "Problem added successfully",
                        variant: "default",
                        duration: 3000
                    })
                    setLoading(true);
                    setProblemId("");
                    setProblemName("");
                    setLoading(false);
                } else {
                    toast({
                        title: "Error",
                        description: "Problem already added",
                        variant: "destructive",
                        duration: 3000
                    })
                }
            })
            .catch(err => {
                toast({
                    title: "Error",
                    description: "Failed to add problem",
                    variant: "destructive",
                    duration: 3000
                })
            })
        fetchContestData();

        setProblemLoading(false);

    }


    return (
        <>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="container mx-auto px-4 py-24">
                {loading &&
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                }

                {!loading &&

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex justify-between items-center">
                                    <div>Edit Contest</div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline"
                                            onClick={() => window.location.href = "/admin/manageContests"}>
                                            <ArrowLeft className="h-6 w-6" />
                                            Go Back
                                        </Button>
                                        <Button onClick={refresh}>
                                            <RefreshCcw className="h-6 w-6" />
                                        </Button>
                                        <Button onClick={saveChanges}>
                                            <Save className="h-6 w-6" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </CardTitle>
                            <CardDescription>Manage contest details and problems</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="contestDetails">
                                <TabsList className="">
                                    <TabsTrigger value="contestDetails" className="px-4 py-2">Contest Details</TabsTrigger>
                                    <TabsTrigger value="problems" className="px-4 py-2">Problems</TabsTrigger>
                                </TabsList>
                                <TabsContent value="contestDetails">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Contest Details</CardTitle>
                                            <CardDescription>Update contest details</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form onSubmit={(e) => e.preventDefault()}
                                                className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="contest-name">Contest Name</Label>
                                                    <Input
                                                        id="contest-name"
                                                        type="text"
                                                        value={contestData.name}
                                                        onChange={(e) => setContestData({ ...contestData, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contest-description">Contest Description</Label>
                                                    <Textarea
                                                        id="contest-description"
                                                        value={contestData.description}
                                                        onChange={(e) => setContestData({ ...contestData, description: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contest-start-date">Start Date</Label>
                                                    <Input
                                                        id="contest-start-date"
                                                        type="datetime-local"
                                                        value={getLocalTime(contestData.startDate)}
                                                        onChange={(e) => setContestData({ ...contestData, startDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contest-end-date">End Date</Label>
                                                    <Input
                                                        id="contest-end-date"
                                                        type="datetime-local"
                                                        value={getLocalTime(contestData.endDate)}
                                                        onChange={(e) => setContestData({ ...contestData, endDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </form>
                                            <div className="space-y-2">
                                                <Label htmlFor="contest-institution">Institution</Label>
                                                <div className="flex justify-between items-center space-x-2">
                                                    <pre>({contestData.code}) - {contestData.institution}</pre>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button >
                                                                {/* Oragnisation Icon */}
                                                                <Building2 className="h-6 w-6" />
                                                                Change Institution
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                                <div className="flex justify-between items-center pr-8">
                                                                    <p className="font-bold">
                                                                        Select Institution
                                                                    </p>
                                                                </div>
                                                            </DialogHeader>
                                                            <Input
                                                                id="institution-search"
                                                                type="text"
                                                                placeholder="Search by institution name or code"
                                                                value={searchInstitution}
                                                                onChange={handleInstitutionSearch}
                                                            />
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableHead>
                                                                        Name
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Code
                                                                    </TableHead>
                                                                </TableHeader>
                                                                <TableBody className="divide-y divide-gray-200">
                                                                    {institutions && searchInstitution.length > 3 && institutions.length > 0 && institutions.filter((institution: any) => institution.name.toLowerCase().includes(searchInstitution?.toLowerCase() || '') || institution.code.toLowerCase().includes(searchInstitution?.toLowerCase() || '')).map((institution: any) => (
                                                                        <TableRow key={institution.id} >
                                                                            <TableCell>{institution.name}</TableCell>
                                                                            <TableCell>{institution.code}</TableCell>
                                                                            <TableCell>
                                                                                <DialogClose>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        onClick={() => handleChangeInsitution(institution.name, institution.code)}>
                                                                                        <Check className="h-6 w-6" />
                                                                                        Select
                                                                                    </Button>

                                                                                </DialogClose>

                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>

                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="problems">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                <div className="flex justify-between items-center">
                                                    <div>Contest Problems</div>
                                                    <div>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button >
                                                                    Add Problem
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    Add Problem
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <Label htmlFor="contest-name">Problem ID</Label>
                                                                    <div className="flex justify-between items-center space-x-2">
                                                                        <Input
                                                                            id="contest-name"
                                                                            type="text"
                                                                            value={problemId}
                                                                            onChange={(e) => setProblemId(e.target.value)}
                                                                            required
                                                                        />
                                                                        <Button
                                                                            disabled={problemLoading}
                                                                            onClick={() => searchProblem()}
                                                                            variant="secondary">
                                                                            <SearchIcon className="h-6 w-6" />
                                                                        </Button>
                                                                        {/* View All problems */}
                                                                        <Button
                                                                            onClick={() => {
                                                                                window.open("/admin/manageProblems", "_blank");
                                                                            }}
                                                                            variant="outline">
                                                                            View All
                                                                        </Button>
                                                                    </div>
                                                                    {problemName.length > 0 && <div >
                                                                        <pre>{problemName}</pre>
                                                                    </div>
                                                                    }
                                                                    {problemName.length > 0 && <Label htmlFor="contest-name">Are you sure you want to add this problem?</Label>}
                                                                </div>
                                                                {
                                                                    problemName.length > 0 &&
                                                                    <div className="flex justify-between items-center space-x-2">
                                                                        <Button
                                                                            disabled={problemLoading}
                                                                            variant="outline">
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={addProblem}
                                                                            disabled={problemLoading}
                                                                            variant="outline">
                                                                            Add Problem
                                                                        </Button>
                                                                    </div>
                                                                }
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            </CardTitle>
                                            <CardDescription>Manage contest problems</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Title
                                                        </TableHead>
                                                        <TableHead>
                                                            Difficulty
                                                        </TableHead>
                                                        <TableHead className="flex justify-center items-center">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {contestData.problems && contestData.problems.length > 0 && contestData.problems.map((problem: Problem) => (
                                                        <TableRow key={problem.id}>
                                                            <TableCell>{problem.title}</TableCell>
                                                            <TableCell>{problem.difficulty}</TableCell>
                                                            <TableCell className="flex justify-center items-center">
                                                                <div className="flex space-x-2">
                                                                    <Button variant="outline"
                                                                        onClick={() => window.location.href = `/admin/editProblem/?id=${problem.id}`}>
                                                                        <Edit2 className="h-6 w-6" />
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => {
                                                                            deleteProblem(problem.id);
                                                                        }}
                                                                        variant="destructive">
                                                                        <Trash className="h-6 w-6" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                        </CardContent>
                    </Card>
                }
            </div>
        </>
    )
}