import { useEffect, useState } from "react";
import Nav from "./nav";
import { Button } from "../ui/button";
import { ArrowLeft, Download, Eye, RefreshCcw, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "../ui/table";

interface Log {
    event_type: string;
    user_id: number;
    endpoint: string;
    ip_address: string;
    createdAt: string;
}

export default function ViewLogs({ props, baseUrl }: { props: any, baseUrl: string }) {
    const { name, email, image, username, isAdmin } = props.data;
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    const [logs, setLogs] = useState<Log[]>([]);
    const { toast } = useToast();

    const fetchLogs = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        await fetch(`${baseUrl}/api/admin/logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                rangeStart: 0,
                rangeEnd: 10
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
                throw new Error("Failed to fetch logs");
            })
            .then(data => {
                setLogs(data.logs);
            })
            .catch(error => {
                console.error(error);
            });
        setLoading(false);
    }

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleRefresh = async () => {
        await fetchLogs();
        toast({
            title: "Logs refreshed",
            description: "Logs have been refreshed",
            variant: "default",
            duration: 3000,
        })
    }

    const handleDownload = async () => {
        const logsJson = JSON.stringify(logs, null, 2);
        const blob = new Blob([logsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'logs.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="container mx-auto px-4 py-24">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
                        </div>
                    </div>
                ) :
                    (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-bold">System Logs</h1>
                                <Button asChild variant="outline">
                                    <a href="/admin/dashboard">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Dashboard
                                    </a>
                                </Button>
                            </div>
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Log Viewer</CardTitle>
                                    <CardDescription>View and analyze system logs</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="flex-1 ">
                                            <div>
                                                <Label htmlFor="search">Search</Label>
                                                <div className="flex items-center">
                                                    <Input
                                                        className="mt-2"
                                                        id="search" placeholder="Search logs"
                                                        value={search}
                                                        onChange={(e) => {
                                                            setSearch(e.target.value)
                                                            setPage(1)
                                                        }}
                                                    />
                                                    <Button
                                                        className="ml-2 mt-2"
                                                        onClick={handleRefresh} disabled={loading}>
                                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                                        Refresh
                                                    </Button>
                                                    <Button className="ml-2 mt-2" onClick={handleDownload} variant="outline">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download Logs
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Timestamp</TableHead>
                                                <TableHead>Event Type</TableHead>
                                                <TableHead>Endpoint</TableHead>
                                                <TableHead>IP Address</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {logs && logs.length > 0 && logs.filter((log: Log) => log.event_type.toLowerCase().includes(search.toLowerCase()) || log.endpoint.toLowerCase().includes(search.toLowerCase()) || log.ip_address.toLowerCase().includes(search.toLowerCase())).map((log: Log) => (
                                                <TableRow key={log.createdAt}>
                                                    <TableCell>{
                                                        new Date(log.createdAt).toLocaleString()
                                                        }</TableCell>
                                                    <TableCell>{log.event_type}</TableCell>
                                                    <TableCell>{log.endpoint}</TableCell>
                                                    <TableCell>{log.ip_address}</TableCell>
                                                    <Button variant="outline" className="m-2">
                                                        <Eye className="w-4 h-4" />
                                                        <p>View</p>
                                                    </Button>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>

                            </Card>
                        </>
                    )}
            </div>
        </>
    );
}