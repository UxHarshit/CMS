import { Ban, Mail, Home, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function BannedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-none text-white">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="animate-appear p-4 bg-red-500/20 rounded-full">
                <Ban className="w-16 h-16 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">Account Banned</CardTitle>
            <CardDescription className="text-xl text-center text-gray-300">
              Your access has been restricted
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg font-medium">Well, this is awkward...</p>
            <p className="text-sm text-gray-400">
              Your account has been banned due to violation of our community guidelines or terms of service. It's like
              being picked last for the team, except the team is our entire platform.
            </p>
  
            <div className="bg-gray-800/50 rounded-lg p-4 text-left">
              <h3 className="font-medium mb-2">Possible reasons include:</h3>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li>Cheating during contests</li>
                <li>Sharing solutions inappropriately</li>
                <li>Harassment or inappropriate behavior</li>
                <li>Multiple violations of platform rules</li>
                <li>Your code was so bad our servers took personal offense</li>
              </ul>
            </div>
          </CardContent>
          
          <div className="bg-gray-700 h-px w-full" />
          
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <p className="text-sm text-gray-400 text-center">
              If you believe this is a mistake, you can contact our support team for assistance.
            </p>
            <div className="flex justify-center space-x-4 w-full">
              <Button variant="destructive" className="w-full" asChild>
                <a href="/contact-support">
                  <Mail className="mr-2 h-4 w-4" />
                  Appeal Ban
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </a>
              </Button>
            </div>
            <Button variant="link" className="text-gray-400" asChild>
              <a href="/terms">
                <HelpCircle className="mr-2 h-4 w-4" />
                Learn more about our policies
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
}