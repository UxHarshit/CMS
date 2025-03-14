import { AlertCircle, Mail, RefreshCw, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";

export default function Verify({ baseUrl }: { baseUrl: string }) {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    setIsResending(true);

    // Simulate API call to resend verification email
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isResending) return;

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    await fetch(`${baseUrl}/api/auth/verify/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Verification email sent",
            description:
              "Please check your inbox (and spam folder) for the email.",
            variant: "default",
            duration: 5000,
          });

        } else {
          toast({
            title: "Failed to resend verification email",
            description: "Too frequent requests or please try again later.",
            variant: "destructive",
            duration: 5000,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Internal server error",
          description:
            "We couldn't resend the verification email. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      });

    setIsResending(false);
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-700 to-gray-900 flex items-center justify-center p-4">
        <Toaster />
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-none text-white">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="animate-appear p-4 bg-amber-500/20 rounded-full">
                <AlertCircle className="w-16 h-16 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              Account Not Verified
            </CardTitle>
            <CardDescription className="text-xl text-center text-gray-300">
              Just one more step to go!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg font-medium">So close, yet so far...</p>
            <p className="text-sm text-gray-400">
              Your account has been created, but you need to verify your email
              address before you can access all features. It's like getting to
              the final round of a coding competition but forgetting to hit the
              submit button.
            </p>

            <Alert className="bg-amber-500/20 border-amber-500/50 text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Why verification matters</AlertTitle>
              <AlertDescription className="text-sm text-gray-300">
                Verification helps us ensure you're a real person and not a very
                clever algorithm trying to infiltrate our human-centric
                platform.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-800/50 rounded-lg p-4 text-left">
              <h3 className="font-medium mb-2">What to do next:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>Return to the platform and log in</li>
                <li>Start coding and competing!</li>
              </ol>
            </div>
          </CardContent>
          <div className="bg-gray-700 h-px w-full" />

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <p className="text-sm text-gray-400 text-center">
              Didn't receive the verification email? We can send it again.
            </p>
            <div className="flex justify-center space-x-4 w-full">
              <Button
                variant="default"
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Email
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </a>
              </Button>
            </div>
            <Button variant="link" className="text-gray-400" asChild>
              <a href="/contact-support">
                <CheckCircle className="mr-2 h-4 w-4" />
                I've verified my email
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <footer className="bg-white dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2025 CodeContest Pro. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
