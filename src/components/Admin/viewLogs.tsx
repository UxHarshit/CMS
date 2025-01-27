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
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../ui/dialog";

interface Log {
    event_type: string;
    user_id: number;
    endpoint: string;
    ip_address: string;
    createdAt: string;
    user_agent: string;
    details: string;
}




export default function ViewLogs({ props, baseUrl, token }: { props: any, baseUrl: string, token: string }) {
    const { name, email, image, username, isAdmin } = props.data;
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [dialogLoading, setDialogLoading] = useState(false);

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

    const [dialogInfo, setDialogInfo] = useState({
        ip: "",
        location: "",
        isp: "",
        organization: ""
    })

    const fetchIpDetails = async (ip: string) => {
        ip = ip.split(":").pop() || ip;
        ip = ip.trim().replace("::ffff:", "");
        const data = await fetch(`https://ipapi.co/${ip}/json/`
        ).then(response => response.json()).catch(error => {
            console.error(error);
        });
        return data;
    }

    const getIpDetails = async (ip: string) => {
        setDialogLoading(true);
        const data = await fetchIpDetails(ip);
        if (data) {
            setDialogInfo({
                ip: data["ip"],
                location: data["city"] + ", " + data["region"] + ", " + data["country_name"],
                isp: data["org"],
                organization: data["org"] // Fixed organization shorthand
            });
        }
        setDialogLoading(false);
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
                                                    <Button
                                                        className="ml-2 mt-2"
                                                        onClick={handleDownload} disabled={loading}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
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
                                                    <Dialog>
                                                        <DialogTrigger className="m-2" asChild>
                                                            <Button variant="outline" onClick={() => getIpDetails(log.ip_address)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Detailed Info</DialogTitle>
                                                                <DialogDescription>
                                                                    Information about the log
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            {dialogLoading ? (
                                                                <div className="flex justify-center items-center h-64">
                                                                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="overflow-y-auto h-96 p-2" >
                                                                    <div className="">
                                                                        <p className="text-lg font-bold">IP Information</p>
                                                                        <div className="flex items-center space-x-4">
                                                                            <div>
                                                                                <p>IP Address: {log.ip_address}</p>
                                                                                <p>Location: {dialogInfo.location}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p>ISP: {dialogInfo.isp}</p>
                                                                                <p>Organization: {dialogInfo.organization}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-full h-px bg-gray-300 my-4"></div>
                                                                    <p className="text-lg font-bold">Request Information</p>
                                                                    <div className="flex flex-col space-y-2">
                                                                        <p> User ID: {log.user_id || "Not available"}</p>
                                                                        <p> User Agent: {log.user_agent}</p>
                                                                        <p> Endpoint: {log.endpoint}</p>
                                                                        <p> Event Type: {log.event_type}</p>
                                                                        <p> Created At: {new Date(log.createdAt).toLocaleString()}</p>
                                                                    </div>

                                                                    <div className="w-full h-px bg-gray-300 my-4"></div>
                                                                    <p className="text-lg font-bold">Request Details</p>
                                                                    <div className="flex flex-col space-y-2 overflow-y-auto">
                                                                        <p> Method: {
                                                                            JSON.parse(log.details).method || "Not available"
                                                                        }</p>
                                                                        <p> Body:</p>
                                                                        {/* <code> of body */}
                                                                        <div className="p-2 rounded-lg bg-gray-100 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                                                                            <code>
                                                                                {JSON.stringify(JSON.parse(log.details).body, null, 2)}
                                                                            </code>
                                                                        </div>

                                                                        <p> Query:
                                                                            <code>
                                                                                {JSON.stringify(JSON.parse(log.details).query, null, 2)}
                                                                            </code>
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                            )
                                                            }

                                                        </DialogContent>
                                                    </Dialog>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>

                            </Card>
                        </>
                    )}
            </div >
        </>
    );
}