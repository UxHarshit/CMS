import Nav from "./nav";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { toast, useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";


interface UserStructure {
    name: string;
    email: string;
    role: string;
    isBanned: boolean;
}

export default function ManageUsers({ props }: { props: any }) {
    const { name, email, image, username, isAdmin } = props.data;

    const { toast } = useToast();

    const [users, setUsers] = useState<UserStructure[]>();
    const [search, setSearch] = useState("");

    const handleBanUser = (email: string) => {
        console.log(`Banning user with email: ${email}`);
        setUsers(users!.map((user: any) => user.email === email ? { ...user, isBanned: true } : user));
    }

    const handleUnbanUser = (email: string) => {
        console.log(`Unbanning user with email: ${email}`);
        setUsers(users!.map((user: any) => user.email === email ? { ...user, isBanned: false } : user));
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleRefresh = () => {
        setUsers(undefined);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        fetch("http://localhost:5000/api/admin/UserList", {
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
                throw new Error("Failed to fetch users");
            })
            .then(data => {

                setUsers(data);
                toast({
                    title: "Users refreshed",
                    description: "Users have been refreshed",
                    variant: "default",
                    duration: 3000,
                })

            })
            .catch(error => {

                toast({
                    title: "Error",
                    description: "Error fetching users",
                    variant: "destructive",
                    duration: 3000,
                })
                console.error("Error fetching users:", error);
            });
    }

    useEffect(() => {
        handleRefresh();
    }, [])



    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
                <Toaster />
                {/* Header */}
                <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
                <div className="flex px-4 py-24">

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>
                                Manage Users
                            </CardTitle>
                            <CardDescription>
                                Manage users and their roles
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end">
                                <Input placeholder="Search users"
                                    className="w-full mb-4"
                                    value={search}
                                    onChange={handleSearch}
                                />
                                <Button
                                    className="ml-2"
                                    onClick={() => {
                                        setUsers(undefined);
                                        handleRefresh();
                                    }}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Name
                                        </TableHead>
                                        <TableHead>
                                            Email
                                        </TableHead>
                                        <TableHead>
                                            Role
                                        </TableHead>
                                        <TableHead>
                                            Banned
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users && users.length > 0 && users.filter((user: any) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())).map((user: any) => (
                                        <TableRow key={user.email}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell className="flex items-center ">
                                                <Checkbox
                                                    id={`user-${user.email}-status`}
                                                    checked={user.isBanned}
                                                    className="w-4 h-4"
                                                    onCheckedChange={() =>
                                                        user.isBanned
                                                            ? handleUnbanUser(user.email)
                                                            : handleBanUser(user.email)
                                                    }
                                                />
                                                <label htmlFor={`user-${user.email}-status`}
                                                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ml-2 pr-2 peer-disabled:opacity-70 ${user.isBanned ? "text-red-500" : "text-green-500"}`}
                                                >
                                                    {user.isBanned ? "Banned" : "Active"}
                                                </label>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}