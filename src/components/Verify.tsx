import {
  AlertCircle,
  Mail,
  RefreshCw,
  Home,
  CheckCircle,
  Loader2,
  ArrowRight,
  XCircle,
  LogIn,
} from "lucide-react";
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

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";
import Footer from "./footer";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function Verify({
  baseUrl,
  pEmail,
}: {
  baseUrl: string;
  pEmail: string;
}) {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  const [email, setEmail] = useState<string>(pEmail);

  const [verificationState, setVerificationState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [timeLeft, setTimeLeft] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle countdown timer for resend code
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    const sent = localStorage.getItem("sent");
    if (!sent) {
      localStorage.setItem("sent", "true");
      handleResendVerification();
    }
  }, []);

  const handleResendVerification = async () => {
    setIsResending(true);
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
          handleResendCode();
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
  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];

    // Handle paste event with multiple characters
    if (value.length > 1) {
      const pastedValues = value.split("").slice(0, 6 - index);
      for (let i = 0; i < pastedValues.length; i++) {
        if (index + i < 6) {
          newOtpValues[index + i] = pastedValues[i];
        }
      }
    } else {
      // Handle single character input
      newOtpValues[index] = value;
    }

    setOtpValues(newOtpValues);

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle key down event for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValues.some((val) => val === "")) {
      setErrorMessage("Please enter the complete verification code");
      return;
    }

    const otp = otpValues.join("");
    setVerificationState("loading");
    setErrorMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${baseUrl}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otp }),
    })
      .then((res) => {
        if (res.status === 200) {
          setVerificationState("success");
          setTimeLeft(0);
          toast({
            title: "Email verified successfully",
            description: "Your email has been verified.",
            variant: "default",
            duration: 5000,
          });
          localStorage.removeItem("sent");
        } else if (res.status === 400) {
          setErrorMessage("Invalid verification code. Please try again.");
          setVerificationState("error");
        } else {
          setErrorMessage(
            "An error occurred. Please try again later or contact support."
          );
          setVerificationState("error");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(
          "An error occurred. Please try again later or contact support."
        );
        setVerificationState("error");
      });
  };

  const handleResendCode = () => {
    setIsResending(true);

    setTimeout(() => {
      setIsResending(false);
      setTimeLeft(360);
      setOtpValues(Array(6).fill(""));
      setErrorMessage("");

      toast({
        title: "Verification code resent",
        description: `A new verification code has been sent to ${email}`,
      });
    }, 1500);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              {verificationState === "success" ? (
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              ) : verificationState === "error" ? (
                <div className="p-3 bg-red-500/20 rounded-full">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              ) : (
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Mail className="w-10 h-10 text-blue-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              {verificationState === "success"
                ? "Your email has been successfully verified!"
                : `We've sent a verification code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {verificationState === "success" ? (
              <div className="text-center space-y-4">
                <p className="text-green-500 font-medium">
                  Your account is now fully activated!
                </p>
                <p className="text-muted-foreground">
                  You now have full access to all features of CodeContest Pro.
                  Get ready to showcase your coding skills and compete with the
                  best!
                </p>
              </div>
            ) : verificationState === "error" && errorMessage ? (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {verificationState !== "success" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-0">Enter verification code</Label>
                  <div className="flex justify-between gap-2">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData =
                            e.clipboardData.getData("text/plain");
                          handleOtpChange(index, pastedData);
                        }}
                        className="w-12 h-12 text-center text-lg"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your email address
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verificationState === "loading"}
                >
                  {verificationState === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {verificationState !== "success" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="link"
                  onClick={handleResendVerification}
                  disabled={isResending || timeLeft > 0}
                  className="text-sm"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                      Resending code...
                    </>
                  ) : timeLeft > 0 ? (
                    `Resend code in ${timeLeft}s`
                  ) : (
                    "Resend verification code"
                  )}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center space-x-4">
            {verificationState === "success" ? (
              <>
                <Button asChild>
                  <a href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In Now
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </a>
                </Button>
              </>
            ) : (
              <div className="flex w-full justify-between">
                <Button variant="outline" asChild>
                  <a href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/logout">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log Out
                  </a>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
}
