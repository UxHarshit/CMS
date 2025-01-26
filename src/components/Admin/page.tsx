import { CalendarDays, Code, Cpu, User, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import Nav from "./nav";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Admin({ props }: { props: any }) {
    const { name, email, image, username, isAdmin } = props.data;
    const { curr_ram_usage, total_ram, cpu_usage } = props.sysinfo;
    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">

                {/* Header */}
                <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
                <div className="container mx-auto px-4 py-24">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                                <Cpu className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">{cpu_usage}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
                                <Cpu className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">
                                {curr_ram_usage}
                            </div>
                            <p className="text-xs text-muted-foreground">of {total_ram} total</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-full h-px bg-gray-300 my-4">

                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Quick Actions</h2>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-300 my-4"></div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        <Button asChild>
                            <a href="/admin/manageUsers">
                                <User className="mr-2 w-4 h-4" />
                                Manage Users
                            </a>
                        </Button>

                        <Button asChild>
                            <a href="/admin/manageContests">
                                <CalendarDays className="mr-2 w-4 h-4" />
                                Manage Contests
                            </a>
                        </Button>

                        <Button asChild>
                            <a href="/admin/manageProblems">
                                <Code className="mr-2 w-4 h-4" />
                                Manage Problems
                            </a>
                        </Button>

                    </div>
                </div>
            </div>
        </>
    )
}