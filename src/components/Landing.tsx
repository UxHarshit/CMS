import { Code, Menu, Moon, ShieldCheck, Sun, Trophy, Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Footer from "./footer";

export default function Landing({isLoggedIn}: {isLoggedIn: boolean}) {
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
        const savedIsLoggedIn = localStorage.getItem('token');

        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        } else{
            setDarkMode(true);
            localStorage.setItem('darkMode', JSON.stringify(true));
            document.documentElement.classList.add('dark');
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

    return (
        <div className="min-h-screen  transition-colors duration-300">

            {/* Header */}
            <header className="fixed w-full backdrop-blur-sm  shadow-sm z-10">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold text-gray-800 dark:text-white">CodeContest Pro</span>
                    </div>
                    <div className="hidden items-center md:flex space-x-4">
                        <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Features</a>
                        <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Pricing</a>
                        <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Contact</a>
                        {!isLoggedIn && (<>
                            <a href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Login</a>
                            <a href="/signup" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Sign Up</a>
                        </>
                        )}
                        {isLoggedIn && (
                            <a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Dashboard</a>

                        )}
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
                <div className={`md:hidden backdrop-blur-lg  overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-52 bg-background ' : 'max-h-0'}`}>
                    <a href="#features" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Features</a>
                    <a href="#pricing" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Pricing</a>
                    <a href="#contact" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Contact</a>
                    {!isLoggedIn &&
                        <a href="/login" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Login</a>
                    }
                    {
                        !isLoggedIn &&
                        <a href="/signup" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Sign Up</a>

                    }
                    {isLoggedIn && (
                        <a href="/dashboard" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Dashboard</a>

                    )}
                </div>
            </header>

            {/* Hero */}
            <section className="pt-24 bg-blue-600 dark:bg-blue-800 text-white">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-down">Organize Secure Coding Competitions with Ease</h1>
                    <p className="text-xl mb-8 animate-fade-in-up">Empower your organization or college to host flawless DSA competitions</p>
                    <a href="/login" className="bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 animate-bounce">
                        Get Started
                    </a>
                </div>
            </section>
            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Why Choose CodeContest Pro?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<ShieldCheck className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
                            title="Advanced Security"
                            description="Ensure the integrity of your contests with our robust security measures."
                        />
                        <FeatureCard
                            icon={<Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
                            title="Plagiarism Prevention"
                            description="Sophisticated algorithms to detect and prevent code plagiarism."
                        />
                        <FeatureCard
                            icon={<Trophy className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
                            title="Fair Evaluation"
                            description="Automated and unbiased evaluation system for all participants."
                        />
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section id="pricing" className="bg-gray-800 dark:bg-gray-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Host Your Next Coding Competition?</h2>
                    <p className="text-xl mb-8">Join hundreds of organizations and colleges using CodeContest Pro</p>
                    <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-1000 animate-pulse">
                        Start Free Trial
                    </a>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Get in Touch</h2>
                    <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Have questions? We're here to help!</p>
                    <a href="mailto:contact@codecontestpro.tech" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                        contact@codecontestpro.tech
                    </a>
                </div>
            </section>
            <Footer/>
        </div>
    )
}


interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
        </div>
    )
}