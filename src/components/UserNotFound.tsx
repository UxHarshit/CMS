import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Code, Ghost, Home, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Footer from "./footer";


export default function UserNotFound() {
    // Theme Setup Start
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }
    // Theme Setup End


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
            <div className="flex items-center justify-center py-24 mx-auto" >
                <Card className="container max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center flex items-center justify-center">
                            <Ghost className="mr-2 h-6 w-6" />
                            User Not Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4" >
                        <p className="text-lg font-medium" >
                            Oh, brilliant! You've discovered our super-secret invisible user feature.
                        </p>
                        <p className="text-muted-foreground" >
                            Unfortunately, it's working a little too well, and we can't see them either.
                        </p>
                        <div className="flex justify-center" >
                            <Search className="h-24 w-24 text-muted-foreground animate-pulse rotate-12 transform origin-center transition-transform duration-1500 ease-in-out
                        "/>
                        </div>
                        <p className="font-semibold">
                            Either way, we're pretty sure they're not here.
                        </p>
                        <Button className="mt-4"  onClick={() => window.location.href = '/'}>
                            <div className="flex  justify-center items-center ">
                                <Home className="mr-2 h-4 w-4" />
                                <span className="font-medium" >Back to reality (I mean, home)</span>
                            </div>
                        </Button>
                    </CardContent>

                </Card>
            </div>
            
        <Footer/>
        </div>
    )
}