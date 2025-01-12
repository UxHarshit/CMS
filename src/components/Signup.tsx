import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Code, Eye, EyeOff, Menu, Moon, Sun, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Command, CommandInput } from "./ui/command";
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";


export default function SignupPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState('');
    const [institution, setInstitution] = useState({
        code: '',
        value: '',
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        institution: { code: '', value: '' },
    });

    // useEffect(() => {
    //     const smoothScroll = (e: Event) => {
    //         e.preventDefault()
    //         const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
    //         if (href) {
    //             const targetId = href.replace('#', '')
    //             const elem = document.getElementById(targetId)
    //             elem?.scrollIntoView({
    //                 behavior: 'smooth'
    //             })
    //         }
    //     }
    //     const links = document.querySelectorAll('a[href^="#"]')
    //     links.forEach(link => {
    //         link.addEventListener('click', smoothScroll)
    //     })
    //     return () => {
    //         links.forEach(link => {
    //             link.removeEventListener('click', smoothScroll)
    //         })
    //     }
    // }, []);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;
        formData.institution = institution;
        if (!institution.code || !institution.value) {
            setError('Please select your institution');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const [firstName, lastName] = name.split(' ');

        if (!firstName || !lastName) {
            setError('Please enter your full name');
            return;
        }

        if (firstName.length < 2 || lastName.length < 2) {
            setError('First name and last name must be at least 2 characters long');
            return;
        }

        if (firstName.length > 50 || lastName.length > 50) {
            setError('First name and last name must be at most 50 characters long');
            return;
        }

        if (firstName.match(/\d/) || lastName.match(/\d/) || firstName.match(/[^a-zA-Z]/) || lastName.match(/[^a-zA-Z]/)) {
            setError('First name and last name must contain only alphabets');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/) || !password.match(/[^a-zA-Z0-9]/)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
            return;
        }

        if (!email.includes('@')) {
            setError('Invalid email address');
            return;
        }

        setError('');

        await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
            } else {
                window.location.href = '/login';
            }
        }).catch(err => {
            console.error(err);
            setError('An error occurred. Please try again later');
        });
    }


    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', JSON.stringify(!darkMode));
        if (darkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">

            {/* Header */}
            <header className="fixed w-full bg-white dark:bg-gray-800 shadow-sm z-10">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold text-gray-800 dark:text-white">CodeContest Pro</span>
                    </div>
                    <div className="hidden items-center md:flex space-x-4">
                        <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Home</a>
                        <a href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Login</a>
                        <Button variant="ghost" onClick={toggleDarkMode} className="">
                            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </Button>
                    </div>
                    <div className="hidden max-md:flex items-center space-x-4">
                        <Button variant="ghost" onClick={toggleDarkMode} className="">
                            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </Button>
                        <button onClick={toggleMobileMenu} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
                            {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </nav>
                {/* Mobile Menu */}
                <div className={`md:hidden bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-48' : 'max-h-0'}`}>
                    <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Home</a>
                    <a href="/login" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Login</a>
                </div>
            </header>

            {/* Signup */}
            <section className="flex items-center justify-center container mx-auto px-4 pt-36 py-24 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md" >
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                        <CardDescription className="text-center">Join CodeContest Pro to start competing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" action="" method="POST" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={handleChange}
                                    id="name" name="name" type="text" autoComplete="name" required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    value={formData.email}
                                    onChange={handleChange}
                                    id="email" name="email" type="email" autoComplete="email" required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="institution">Institution or Organization</Label>
                                <InstitutionCommand onSelect={setInstitution} />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative mt-1">
                                    <Input
                                        onChange={handleChange}
                                        value={formData.password}
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="password">Confirm Password</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex items-center">
                                <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" required />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                                    I agree all details are correct and institution can't be changed later.
                                </label>
                            </div>
                            <Button type="submit" className="w-full" >Register</Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account? {' '}
                            <a href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Log in</a>
                        </p>
                    </CardFooter>

                </Card>
            </section>


            <footer className="bg-white dark:bg-gray-800 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
                    <p>&copy; 2024 CodeContest Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}


const institutions = [
    {
        code: "liet",
        value: "Lloyd Institute of Engineering and Technology",
        label: "Lloyd Institute of Engineering and Technology",
    }
];

export function InstitutionCommand({ onSelect }: { onSelect: (value: { code: string, value: string }) => void }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    if (!institutions || institutions.length === 0) {
        console.error("No institutions data found!");
        return <p>No institutions available.</p>;
    }
    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between mt-1">
                        {value ? institutions.find(i => i.value === value)?.label : 'Select Institution...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 border rounded-sm shadow-lg mb-1 z-10">
                    <Command>
                        <CommandInput value={inputValue} onValueChange={setInputValue} placeholder="Search institution..." />
                        <CommandEmpty>
                            {inputValue.length < 3
                                ? "Type at least 3 characters to search"
                                : "No results found"
                            }
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {institutions.filter(institution => inputValue.length >= 3 && institution.label.toLowerCase()).map((institution) => (
                                    <CommandItem
                                        key={institution.value}
                                        value={institution.value}
                                        className="flex items-center"
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? '' : currentValue);
                                            onSelect({ code: institution.code, value: institution.value });
                                            setOpen(false);
                                        }} >
                                        <Check
                                            className={cn("mr-2 h-4 w-2", value === institution.value ? "opacity-100" : "opacity-0")} />
                                        {`[${institution.code}] ${institution.label}`}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>

                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}