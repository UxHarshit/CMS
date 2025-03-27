import { useEffect, useState } from 'react';
import { Code, Moon, Sun, Menu, X, Mail, MapPin, Calendar, Edit, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Badge } from './ui/badge';
import { jwtDecode } from 'jwt-decode';
import Footer from './footer';

interface User {
  username: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  joinedDate: string;
  achievements: string[];
  location: string;
  institution_name: string;
}

export default function Profile({ user }: { user: User }) {

  const data = {
    name: "Harshit Katheria",
    username: "uxharshit",
    email: "harshitkatheria7890@gmail.com",
    avatar: "https://i.pinimg.com/736x/7a/f0/5f/7af05f4b108f471da5db2dca9cc3ae1a.jpg",
    location: "Noida, India",
    joinDate: "December 2024",
    bio: "Passionate coder and problem solver. Always eager to learn and take on new challenges.",
    achievements: ["DSA Master", "100 Day Coding Streak", "Top Contributor"],
    // recentContests: [
    //   { name: "Global Coding Challenge 2024", rank: 5 },
    //   { name: "Algorithm Showdown", rank: 1 },
    //   { name: "Data Structures Duel", rank: 3 },
    //]
    recentContests : []
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [ownProfile, setOwnProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const token = localStorage.getItem('token');

    if (token && token !== 'undefined') {
      const decoded = jwtDecode(token as string) as { email: string, username: string };
      const email = decoded.email;
      const username = decoded.username;
      if (email === user.email || username === user.username) {
        setOwnProfile(true);
      }
      setIsLoggedIn(true);
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
    <div className="min-h-screen transition-colors duration-300 ease-in-out">

      {/* Header */}
      <header className="fixed w-full backdrop-blur-sm  shadow-sm z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">CodeContest Pro</span>
          </div>
          <div className="hidden items-center md:flex space-x-4">
            <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">Home</a>
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
        <div className={`md:hidden bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-48' : 'max-h-0'}`}>
          <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={toggleMobileMenu}>Home</a>
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

      {/* Main Content */}
      <div className='container mx-auto px-4 pt-24 py-8'>
        <div className='max-w-3x1 mx-auto space-y-8'>
          {/* User info card */}
          <Card>
            <CardHeader className='pb-0'>
              <div className='flex justify-between' >
                <div className='flex space-x-4 '>
                  <Avatar className='h-20 w-20 flex-shrink-0 text-center'>
                    <AvatarImage className='rounded-full' src={user.avatar} alt={user.name} />
                    <AvatarFallback className='rounded-full bg-gray-500 flex text-5xl w-full h-full items-center justify-center' >{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div >
                    <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                    <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>
                {ownProfile &&
                  <Button variant="ghost" >
                    <Edit className='h-5 w-5 ' />
                  </Button>
                }
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Mail className="h-5 w-5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Building2 className="h-5 w-5" />
                  <span>{user.institution_name}</span>
                </div>

              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{user.bio}</p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {user.achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Contests</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data.recentContests && data.recentContests.length > 0  ? data.recentContests.map((contest , index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{contest["name"]}</span>
                    <Badge variant="secondary">
                      Rank: {contest["rank"]}
                    </Badge>
                  </li>
                )) : <p>No recent contests</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

    <Footer/>
    </div>
  )
}
