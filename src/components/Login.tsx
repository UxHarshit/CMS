import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Code, Eye, EyeOff, Menu, Moon, Sun, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

export default function LoginPage({ baseUrl }: { baseUrl: string }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [enableSubmit, setEnableSubmit] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


    useEffect(() => {
        const smoothScroll = (e: Event) => {
            e.preventDefault()
            const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
            if (href) {
                const targetId = href.replace('#', '')
                const elem = document.getElementById(targetId)
                elem?.scrollIntoView({
                    behavior: 'smooth'
                })
            }
        }
        const links = document.querySelectorAll('a[href^="#"]')
        links.forEach(link => {
            link.addEventListener('click', smoothScroll)
        })
        return () => {
            links.forEach(link => {
                link.removeEventListener('click', smoothScroll)
            })
        }
    }, []);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        }

    }, []);
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEnableSubmit(false);
        setIsLoading(true);

        const { email, password } = formData;

        if (!email || !password) {
            setError('Please fill all fields');
            setEnableSubmit(true);
            setIsLoading(false);
            return;
        }

        setError('');

        // localhost:5000/api/auth/login
        fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message);
                    setEnableSubmit(true);
                    return;
                }
                localStorage.setItem('token', data.token);

                // cookie with time expiry of 7 days
                document.cookie = `token=${data.token}; max-age=${60 * 60 * 24 * 7}; path=/`;
                window.location.replace('/dashboard');
                history.pushState({}, '', '/dashboard');
                window.addEventListener('popstate', () => {
                    window.location.replace('/dashboard');
                });
            })
            .catch(err => {
                console.log(err)
                setError('An error occurred. Please try again')
                setEnableSubmit(true);
            })

            setIsLoading(false);

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
                        <a href="/signup" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Sign Up</a>
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
                    <a href="/signup" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Signup</a>
                </div>
            </header>

            {/* Login */}
            <section className="flex items-center justify-center container mx-auto px-4 pt-36 py-24 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md" >
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Log in to CodeContest Pro</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" action="" method="POST" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    onChange={handleChange}
                                    value={formData.email}
                                    id="email" name="email" type="email" autoComplete="email" required className="mt-1" />
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
                                        autoComplete="current-password"
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

                            {isLoading ? 
                                <Button disabled className="w-full">Loading...</Button> 
                            :
                                <Button
                                    disabled={!enableSubmit}
                                    type="submit" className="w-full" >Login</Button>
                            }
                                    
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account? {' '}
                            <a href="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Sign Up</a>
                        </p>
                    </CardFooter>

                </Card>
            </section>


            <footer className="bg-white dark:bg-gray-800 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
                    <p>&copy; 2025 CodeContest Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}