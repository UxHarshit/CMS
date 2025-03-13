import Nav from "./nav";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from 'lucide-react';


export default function Page({ props, baseUrl }: { props: any, baseUrl: string }) {
    const { name, email, image, username, isAdmin } = props.data;
    const { contests } = props.data;
    const { running, past } = contests;
    
    interface Contest {
        id: number,
        name: string,
        totalParticipants: number,
        description: string,
        startDate: string,
        endDate: string,
        isAdmin: boolean
    }

    function getDate(start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const currentDate = new Date();

        if (currentDate.getTime() > endDate.getTime()) {
            return "Ended";
        } else if (currentDate.getTime() < startDate.getTime()) {
            if (Math.floor((startDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60) < 1) {
                return "Starts in " + Math.floor((startDate.getTime() - currentDate.getTime()) / 1000 / 60) + "min";
            } else {
                return "Starts at " + startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
        } else {
            if (Math.floor((endDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60) < 1) {
                return "Ends in " + Math.floor((endDate.getTime() - currentDate.getTime()) / 1000 / 60) + "min";
            }
            else if (Math.floor((endDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60) > 24) {
                return "Ends at " + endDate.toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric' });
            }
            else {
                return "Ends at " + endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
        }
    }

    function joinContest(contest: Contest) {
        window.location.href = '/contest/' + contest.id + '/rules';
        return;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">

                {/* Header */}
                <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />

                {/* Login */}
                <div className='container mx-auto py-24 px-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8' >
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2' >
                                <CardTitle className="text-sm font-medium" >Total Contests</CardTitle>
                                <CalendarDays className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold' >
                                    {running.length + past.length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className="text-sm font-medium" >Running Contests</CardTitle>
                                <Badge variant="secondary">{running.length}</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{running.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium" >Ended Contests</CardTitle>
                                <Badge variant="secondary">{past.length}</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{past.length}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Running Contests</CardTitle>
                                <CardDescription>Currently active competitions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-6'>
                                    {running.map((contest: Contest, index: number) => {
                                        return (
                                            <li className='border-b pb-4 last:border-b-0 last:pb-0' key={index}>
                                                <div className='flex justify-between items-start mb-2'>
                                                    <div>
                                                        <p className='font-medium text-lg'>{contest.name}</p>

                                                        <p className='text-sm text-muted-foreground'>{contest.totalParticipants == 0 ? 'No One' : contest.totalParticipants} Joined</p>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {getDate(contest.startDate, contest.endDate)}
                                                    </Badge>
                                                </div>
                                                <p className='text-sm mb-2'>
                                                    {contest.description}
                                                </p>
                                                {contest.endDate > new Date().toISOString() &&
                                                    <Button size="sm"
                                                        onClick={() => joinContest(contest)}>
                                                        Join Contest
                                                    </Button>
                                                }
                                            </li>
                                        )
                                    })}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Ended Contests</CardTitle>
                                <CardDescription>Recently Ended Contests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-6'>
                                    {past.map((contest: Contest, index: number) => {
                                        return (
                                            <li className='border-b pb-4 last:border-b-0 last:pb-0' key={index}>
                                                <div className='flex justify-between items-start mb-2'>
                                                    <div>
                                                        <p className='font-medium text-lg'>{contest.name}</p>
                                                        <p className='hidden text-sm text-muted-foreground'>{contest.totalParticipants} participants</p>
                                                    </div>
                                                    <Badge variant="outline">{getDate(contest.startDate, contest.endDate)}</Badge>
                                                </div>
                                                <p className='text-sm mb-2'>
                                                    {contest.description}
                                                </p>
                                            </li>
                                        )
                                    })}


                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <footer className="bg-white dark:bg-gray-800 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
                    <p>&copy; 2024 CodeContest Pro. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}