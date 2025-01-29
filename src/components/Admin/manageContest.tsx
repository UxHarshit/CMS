import { useEffect, useState } from "react";
import Nav from "./nav";
import { Button } from "../ui/button";
import { Edit, Edit3, PlusCircle, RefreshCw, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipProvider } from "../ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";


interface Contest {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    institution: string;
}


export default function ManageContest({ props, baseUrl }: { props: any, baseUrl: string }) {
    const { name, email, image, username, isAdmin } = props.data;

    const [contests, setContests] = useState<Contest[]>()
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    const { toast } = useToast();

    function fetchContests() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        fetch(`${baseUrl}/api/admin/allContests`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, body: JSON.stringify(
                {
                    "rangeStart": 0,
                    "rangeEnd": 10
                }
            )
        })
            .then(res => res.json())
            .then(data => {
                setContests(data);
            })
            .catch(err => console.log(err));

    }

    function refresh() {
        fetchContests();
        toast({
            title: "Refreshed",
            description: "Contests refreshed successfully",
            variant: "default",
            duration: 5000
        });
    }

    function showTooltip(title: string, description: string , duration: number) {
        toast({
            title: title,
            description: description,
            variant: "default",
            duration: duration
        });
    }

    useEffect(() => {
        fetchContests();
    }, []);

    return (
        <>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="flex flex-col px-4 py-24">
                <div className="flex w-full justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Contests</h1>
                    <Button onClick={() => window.location.href = "/admin/addContest"}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Contest
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Contest Management</CardTitle>
                        <CardDescription>View, edit, and manage coding contests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Label htmlFor="search-contests">Search Contests</Label>
                            <div className="flex items-center space-x-2 mt-2">
                                <Search className="h-6 w-6 text-muted-foreground" />
                                <Input
                                    id="search-contests"
                                    placeholder="Search by contest name"
                                    value={search}
                                    onChange={handleSearch}
                                />
                                <Button onClick={refresh}>
                                    <RefreshCw className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Institution</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contests?.filter(contest => contest.name.toLowerCase().includes(search.toLowerCase())).map(contest => (
                                    <TableRow key={contest.id}>
                                        <TableCell>{contest.name}</TableCell>
                                        <TableCell
                                            // onHover 
                                            onMouseEnter={() => {
                                                showTooltip("Description", contest.description, 5000)
                                            }}
                                            onMouseLeave={() => {
                                                showTooltip("", "", 0.2)
                                            }}
                                            className="truncate" style={{ maxWidth: "300px" }}>{contest.description}</TableCell>
                                        <TableCell>{new Date(contest.startDate).toLocaleDateString() + " " + new Date(contest.startDate).toLocaleTimeString()}</TableCell>
                                        <TableCell>{new Date(contest.endDate).toLocaleDateString() + " " + new Date(contest.endDate).toLocaleTimeString()}</TableCell>
                                        <TableCell
                                            // onHover
                                            onMouseEnter={() => {
                                                showTooltip("Institution", contest.institution, 5000)
                                            }}
                                            onMouseLeave={() => {
                                                showTooltip("", "", 0.2)
                                            }}>
                                            {contest.institution}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => window.location.href = `/admin/editContest/${contest.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div >
        </>
    )
}