import { Code, Moon, Sun, Menu, X, User, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function Nav({ name, email, image, username }: { name: string, email: string, image: string, username: string }) {

    const [darkMode, setDarkMode] = useState(false);
    const firstname = name.split(' ')[0];


    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', `${!darkMode}`);
        if (darkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }

    useEffect(() => {
        if (localStorage.getItem('darkMode') === 'true') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    return (
        <>
            <header className="fixed w-full bg-white dark:bg-gray-800 shadow-sm z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold text-gray-800 dark:text-white">CodeContest Pro</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <div className='md:inline'>
                            <Button variant="ghost" onClick={toggleDarkMode}>
                                {darkMode ? <Sun className='h-8 w-8' /> : <Moon className='h-8 w-8' />}
                            </Button>
                        </div>
                        <span className='hidden md:inline text-gray-600 dark:text-gray-300'>Welcome, {firstname}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className=''>
                                    <Avatar>
                                        <AvatarImage src={image} alt={name} />
                                        <AvatarFallback className='rounded-full bg-gray-500 flex text-2xl w-full h-full items-center justify-center' >{name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-56 z-10' forceMount >
                                <DropdownMenuLabel className='font-normal' >
                                    <div className='flex flex-col space-y-1'>
                                        <p className='text-sm font-medium leading-none' >{name}</p>
                                        <p className='text-xs leading-none text-muted-foreground'>
                                            {email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild >
                                    <a href={`/`} >
                                        Home
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild >
                                    <a href={`/profile/${username}`} >
                                        Profile
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild >
                                    <a href={`/settings`} >
                                        Settings
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild >
                                    <a href={`/logout`} >
                                        Logout
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
        </>
    )
}