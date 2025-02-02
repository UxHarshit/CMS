import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import Nav from "./nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";


import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Building2, Check } from "lucide-react";

interface Institution {
    id: string;
    name: string;
    code: string;
}



export default function AddContest({ props, baseUrl }: { props: any, baseUrl: string }) {
    const { name, email, image, username, isAdmin } = props.data;
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [institution, setInstitution] = useState({
        name: "",
        code: ""
    });



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

    const handleChangeInsitution = (name: string, code: string) => {
        setInstitution({
            name: name,
            code: code
        });
    }

    const createContest = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }

        if (!title || !description || !start || !end || !institution.name || !institution.code) {
            toast({
                title: "Error",
                description: "Please fill all fields",
                variant: "destructive",
                duration: 3000,
            })
            setLoading(false);
            return;
        }

        fetch(`${baseUrl}/api/admin/addContest`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name : title,
                description,
                startDate : new Date(start).toISOString(),
                endDate : new Date(end).toISOString(),
                institutionCode: institution.code
            })
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                const { id } = data;
                window.location.href = `/admin/editContest/${id}`;
            } else {
                toast({
                    title: "Error",
                    description: "Error adding contest",
                    variant: "destructive",
                    duration: 3000,
                })
            }

        }).catch(err => {
            console.log(err);
            toast({
                title: "Error",
                description: "Error adding contest",
                variant: "destructive",
                duration: 3000,
            })
        })

        setLoading(false);
    }


    return (
        <>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="flex px-4 py-24">
                <form onSubmit={(e) => { e.preventDefault() }} className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex justify-between items-center">
                                    Add Contest
                                    <Button onClick={() => {
                                        createContest();
                                    }}>
                                        Add Contest
                                    </Button>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                Fill in the form below to add a new contest
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="name">Contest Name</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text" id="name" name="name" placeholder="Contest Name" />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    type="text" id="description" name="description" placeholder="Description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-2 ">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        type="datetime-local" id="start" name="start" />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        type="datetime-local" id="end" name="end" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contest-institution">Institution</Label>
                                    <div className="flex justify-between items-center space-x-2">
                                        {institution.name && <p>{institution.name} ({institution.code})</p>}
                                        {!institution.name && <p>No institution selected</p>}
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
                            </div>


                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    )
};