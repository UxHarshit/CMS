import { Code, Moon, Sun, Menu, X, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
export default function Nav({
  name,
  email,
  image,
  username,
  endTime,
  id,
  score,
}: {
  name: string;
  email: string;
  image: string;
  username: string;
  endTime: string;
  id: string;
  score: number;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const firstname = name.split(" ")[0];
  const calculateTimeLeft = () => {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      window.location.replace(`/contest/${id}/leaderboard`);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", `${!darkMode}`);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <>
      <header className="fixed w-full backdrop-blur-sm shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              CodeContest Pro
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="md:flex flex-wrap gap-2 items-center space-x-2">
              {/* Finish Contest Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Finish Contest</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    Are you sure you want to finish the contest?
                    <AlertDialogDescription>
                      Once you finish the contest, you will not be able to
                      submit any more solutions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          window.location.replace(`/contest/${id}/leaderboard`);
                        }}
                      >
                        Finish Contest
                      </Button>
                    </>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Styled Timer of Contest */}
              <div className="flex flex-wrap items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md p-2">
                <CalendarDays className="h-4 w-4" />
                <span className="text-gray-600 dark:text-gray-300">
                  {/* 00:00:00 */}
                  {timeLeft.days > 0 && `${timeLeft.days}D : `}
                  {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
                </span>
              </div>

              <div className="flex flex-wrap items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md p-2">
                <CalendarDays className="h-4 w-4" />
                <span className="text-gray-600 dark:text-gray-300">
                  Score: {score}
                </span>
              </div>
              <Button variant="ghost" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="h-8 w-8" />
                ) : (
                  <Moon className="h-8 w-8" />
                )}
              </Button>
            </div>
            <span className="md:inline text-gray-600 dark:text-gray-300">
              Welcome, {firstname}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="">
                  <Avatar>
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback className="rounded-full bg-gray-500 flex text-2xl w-full h-full items-center justify-center">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-10" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`/dashboard`}>Dashboard</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/logout`}>Logout</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
