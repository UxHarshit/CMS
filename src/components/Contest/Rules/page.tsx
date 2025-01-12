import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Nav from './nav'




export default function RulesPage(props: any) {
    const [accepted, setAccepted] = useState(false)
    const { name, email, image, username } = props.message;

    const rules = [
        "Participants must solve the problems independently without any external help.",
        "The use of pre-written code is not allowed, except for standard library functions.",
        "Submissions will be checked for plagiarism. Any form of cheating will result in disqualification.",
        "Time limits and memory constraints must be strictly adhered to for each problem.",
        "Participants are allowed to use any programming language supported by the platform.",
        "The judge's decision is final in all matters related to the contest."
    ]
    const handleAccept = () => {
        setAccepted(!accepted)
    }

    const handleProceed = async() => {
        if (accepted) {
            window.location.href = '/contest/' + props.message.contestId + '/problem';
        }
    }
    
    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
                <Nav name={name} email={email} image={image} username={username} />

                <div className='container mx-auto px-4 py-24'>
                    <Card className='max-w-2xl 2xl mx-auto' >
                        <CardHeader>
                            <CardTitle>Contest Rules</CardTitle>
                            <CardDescription>
                                Please read the following rules carefully before proceeding to the contest.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                {rules.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className='flex flex-col items-start space-y-4' >
                            <div className='flex items-center space-x-2'>
                                <Checkbox id='accept-rules' checked={accepted} onCheckedChange={handleAccept}>

                                </Checkbox>
                                <label htmlFor='accept-rules' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    I have read and agree to the contest rules
                                </label>
                            </div>
                            <Button onClick={handleProceed} disabled={!accepted} >Proceed to Challenge</Button>
                        </CardFooter>
                    </Card>
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