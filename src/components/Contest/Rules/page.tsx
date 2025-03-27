import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Nav from "./nav";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";

export default function RulesPage({
  message,
  baseUrl,
}: {
  message: any;
  baseUrl: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const { name, email, image, username } = message;
  const { toast } = useToast();
  const rules = [
    "Participants must solve the problems independently without any external help.",
    "The use of pre-written code is not allowed, except for standard library functions.",
    "Submissions will be checked for plagiarism. Any form of cheating will result in disqualification.",
    "Time limits and memory constraints must be strictly adhered to for each problem.",
    "Participants are allowed to use any programming language supported by the platform.",
    "The judge's decision is final in all matters related to the contest.",
  ];
  const handleAccept = () => {
    setAccepted(!accepted);
  };

  const handleProceed = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (accepted) {
      await fetch(`${baseUrl}/api/contest/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contestId: message.contestId,
        }),
      })
        .then((res) => {
          if (res.ok) {
            window.location.href =
              "/contest/" + message.contestId + "/problem";
          } else {
            toast({
              title: "Error",
              description: "You have already joined this contest or you are disqualified.",
              variant: "destructive",
            });
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: "Server error. Please try again later.",
            variant: "destructive",
          });
        });

      //
    }
  };

  return (
    <>
      <div className="min-h-screen transition-colors duration-300 ease-in-out">
        <Toaster />
        <Nav name={name} email={email} image={image} username={username} />

        <div className="container mx-auto px-4 py-24">
          <Card className="max-w-2xl 2xl mx-auto">
            <CardHeader>
              <CardTitle>Contest Rules</CardTitle>
              <CardDescription>
                Please read the following rules carefully before proceeding to
                the contest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accept-rules"
                  checked={accepted}
                  onCheckedChange={handleAccept}
                ></Checkbox>
                <label
                  htmlFor="accept-rules"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and agree to the contest rules
                </label>
              </div>
              <Button onClick={handleProceed} disabled={!accepted}>
                Proceed to Challenge
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Footer/>
    </>
  );
}
