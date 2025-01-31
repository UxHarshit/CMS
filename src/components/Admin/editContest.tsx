import Nav from "./nav";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Building2, Check, Edit2, RefreshCcw, Save, SaveIcon, Trash } from "lucide-react";
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
        fetchContestData();
        toast({
            title: "Refreshed",
            description: "Contest refreshed successfully",
            variant: "default",
            duration: 3000
        })
    }
    useEffect(() => {
        fetchContestData();
    }, [])

    const saveChanges = async () => {
    }


    function getLocalTime(date: string) {
        const d = new Date(date);
        const offset = d.getTimezoneOffset();
        d.setMinutes(d.getMinutes() - offset);
        return d.toISOString().slice(0, 16);
    }


    return (
        <>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="container mx-auto px-4 py-24">
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
                                                                                    onClick={() => {
                                                                                        setContestData({ ...contestData, institution: institution.name, code: institution.code })
                                                                                    }}>
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
                                                    <Button >
                                                        Add Problem
                                                    </Button>
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
                                                                    onClick={() => window.location.href = `/admin/editProblem/${problem.id}`}>
                                                                    <Edit2 className="h-6 w-6" />
                                                                </Button>
                                                                <Button variant="destructive">
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
            </div>
        </>
    )
}