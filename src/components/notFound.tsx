import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Frown, Home, RefreshCcw } from 'lucide-react'


const sarcasticMessages = [
    "Congratulations! You've successfully reached the void.",
    "This page is playing hide and seek. You're not very good at it.",
    "404: Page not found. But you found our sense of humor!",
    "Oops! Looks like you've wandered into the digital wilderness.",
    "This page has gone on a vacation. Probably to a beach with better Wi-Fi.",
    "You've discovered the secret 404 page! Now you're one of the cool kids.",
    "You've reached the end of the internet. Just kidding, you're lost.",
    "This page is on a coffee break. Try again later."
]


export default function NotFound() {
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        setMessage(sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)])
        localStorage.getItem('darkMode') === 'true' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 from-gray-800 dark:to-gray-900">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-none text-white">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
                    <CardDescription className="text-xl text-center text-gray-300">Page Not Found</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="animate-appear">
                        <Frown className="w-24 h-24 mx-auto text-yellow-400" />
                    </div>
                    <p className="text-lg font-medium">{message}</p>
                    <p className="text-sm text-gray-400">
                        The page you're looking for has either been moved, deleted, or never existed in the first place. Much like
                        your chances of winning this coding contest.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                    <Button onClick={
                        () => {
                            window.location.href = "/"
                        }
                    }
                        className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}