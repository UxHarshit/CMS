import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Nav from "./nav";
import { Button } from "../ui/button";  
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Mail } from "lucide-react";
import { Toaster } from "../ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function EmailTesting({ props, baseUrl }: { props: any, baseUrl: string }) {

    
    const [testEmailRecipient, setTestEmailRecipient] = useState("");
    const { name, email, image, username, isAdmin } = props.data;
    const [testEmailSubject, setTestEmailSubject] = useState("");
    const [testEmailBody, setTestEmailBody] = useState("");
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);

    const handleSendTestEmail = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/admin/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                recipient: testEmailRecipient,
                subject: testEmailSubject,
                body: testEmailBody,
            }),
        });
        const data = await response.json();
        if (data.success) {
            toast({
                title: "Success",
                description: "Email sent successfully",
                variant: "default",
                duration: 3000,
            })
        } else {
            toast({
                title: "Error",
                description: "Failed to send email",
                variant: "destructive",
                duration: 3000,
            })
        }
        setLoading(false);
    };
    return (
        <>
        <Toaster />
            <Nav name={name} email={email} image={image} username={username} isAdmin={isAdmin} />
            <div className="container mx-auto px-4 py-24">
            <Card>
            <CardHeader>
              <CardTitle>Email Test</CardTitle>
              <CardDescription>Send a test email to verify email functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendTestEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email-recipient">Recipient Email</Label>
                  <Input
                    id="test-email-recipient"
                    type="email"
                    placeholder="recipient@example.com"
                    value={testEmailRecipient}
                    onChange={(e) => setTestEmailRecipient(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-email-subject">Subject</Label>
                  <Input
                    id="test-email-subject"
                    type="text"
                    placeholder="Test Email Subject"
                    value={testEmailSubject}
                    onChange={(e) => setTestEmailSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-email-body">Email Body</Label>
                  <Textarea
                    id="test-email-body"
                    placeholder="Enter the email content here..."
                    value={testEmailBody}
                    onChange={(e) => setTestEmailBody(e.target.value)}
                    required
                  />
                </div>
                <Button
                  disabled={loading}
                 type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
              </form>
            </CardContent>
          </Card>
            </div>
        </>
    );
}