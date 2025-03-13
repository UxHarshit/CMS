import { FileText, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function TermsAndConditions() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="text-white mb-6" asChild>
            <a href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </a>
          </Button>

          <Card className="bg-white/10 backdrop-blur-md border-none text-white">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-500/20 rounded-full">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Terms and Policies
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                The fine print that everyone skips but really shouldn't.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="terms" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                  <TabsTrigger value="conduct">Code of Conduct</TabsTrigger>
                  <TabsTrigger value="copyright">Copyright</TabsTrigger>
                </TabsList>

                <TabsContent value="terms" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Terms of Service</h2>
                    <p className="text-sm text-gray-400">
                      Last updated: Feb 16, 2025
                    </p>
                  </div>
                  <div className="bg-gray-700 h-px w-full" />

                  <div className="space-y-4 text-gray-300">
                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        1. Acceptance of Terms
                      </h3>
                      <p>
                        By accessing or using CodeContest Pro, you agree to be
                        bound by these Terms of Service. If you do not agree to
                        these terms, please do not use our platform.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        2. Description of Service
                      </h3>
                      <p>
                        CodeContest Pro provides a platform for organizing and
                        participating in coding competitions. We reserve the
                        right to modify, suspend, or discontinue any aspect of
                        the service at any time.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">3. User Accounts</h3>
                      <p>
                        You are responsible for maintaining the confidentiality
                        of your account information and for all activities that
                        occur under your account. You agree to notify us
                        immediately of any unauthorized use of your account.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">4. User Conduct</h3>
                      <p>You agree not to use the service to:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe upon the rights of others</li>
                        <li>Submit false or misleading information</li>
                        <li>Upload or transmit viruses or malicious code</li>
                        <li>
                          Attempt to gain unauthorized access to our systems
                        </li>
                        <li>
                          Engage in cheating or plagiarism during contests
                        </li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">5. Termination</h3>
                      <p>
                        We reserve the right to terminate or suspend your
                        account and access to the service at our sole
                        discretion, without notice, for conduct that we believe
                        violates these Terms of Service or is harmful to other
                        users, us, or third parties, or for any other reason.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        6. Limitation of Liability
                      </h3>
                      <p>
                        In no event shall CodeContest Pro be liable for any
                        indirect, incidental, special, consequential, or
                        punitive damages, including without limitation, loss of
                        profits, data, use, goodwill, or other intangible
                        losses.
                      </p>
                    </section>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Privacy Policy</h2>
                    <p className="text-sm text-gray-400">
                      Last updated: Feb 16, 2025
                    </p>
                  </div>
                  <div className="bg-gray-700 h-px w-full" />

                  <div className="space-y-4 text-gray-300">
                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        1. Information We Collect
                      </h3>
                      <p>
                        We collect information you provide directly to us, such
                        as when you create an account, participate in contests,
                        or contact support. This may include your name, email
                        address, username, and profile information.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        2. How We Use Your Information
                      </h3>
                      <p>We use the information we collect to:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        <li>Provide, maintain, and improve our services</li>
                        <li>
                          Process transactions and send related information
                        </li>
                        <li>
                          Send technical notices, updates, and administrative
                          messages
                        </li>
                        <li>
                          Respond to your comments, questions, and requests
                        </li>
                        <li>
                          Monitor and analyze trends, usage, and activities
                        </li>
                        <li>
                          Detect, investigate, and prevent fraudulent
                          transactions and other illegal activities
                        </li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        3. Sharing of Information
                      </h3>
                      <p>
                        We may share your information with third-party vendors,
                        consultants, and other service providers who need access
                        to such information to carry out work on our behalf.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">4. Data Security</h3>
                      <p>
                        We take reasonable measures to help protect information
                        about you from loss, theft, misuse, and unauthorized
                        access, disclosure, alteration, and destruction.
                      </p>
                    </section>
                  </div>
                </TabsContent>

                <TabsContent value="conduct" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Code of Conduct</h2>
                    <p className="text-sm text-gray-400">
                      Last updated: Feb 16, 2025
                    </p>
                  </div>
                  <div className="bg-gray-700 h-px w-full" />

                  <div className="space-y-4 text-gray-300">
                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        1. Community Guidelines
                      </h3>
                      <p>
                        Our community is built on respect, collaboration, and
                        fair play. We expect all users to contribute to a
                        positive and inclusive environment.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        2. Contest Integrity
                      </h3>
                      <p>
                        Participants must compete honestly and independently.
                        Cheating, plagiarism, and unauthorized collaboration are
                        strictly prohibited and may result in disqualification
                        and account suspension.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        3. Communication Standards
                      </h3>
                      <p>
                        All communication on our platform should be respectful
                        and constructive. Harassment, hate speech, and
                        inappropriate content will not be tolerated.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        4. Reporting Violations
                      </h3>
                      <p>
                        If you witness behavior that violates our Code of
                        Conduct, please report it immediately through the
                        Contact Support page. All reports will be reviewed and
                        appropriate action will be taken.
                      </p>
                    </section>
                  </div>
                </TabsContent>

                <TabsContent value="copyright" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Copyright Policy</h2>
                    <p className="text-sm text-gray-400">
                      Last updated: Feb 16, 2025
                    </p>
                  </div>
                  <div className="bg-gray-700 h-px w-full" />

                  {/* <div className="space-y-4 text-gray-300">
                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        1. Content Ownership
                      </h3>
                      <p>
                        Users retain ownership of the content they create and
                        submit to the platform. By submitting content, you grant
                        CodeContest Pro a non-exclusive, worldwide, royalty-free
                        license to use, reproduce, and display the content in
                        connection with the service.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">
                        2. Copyright Infringement
                      </h3>
                      <p>
                        We respect the intellectual property rights of others
                        and expect our users to do the same. We will respond to
                        notices of alleged copyright infringement that comply
                        with applicable law.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">3. DMCA Notices</h3>
                      <p>
                        If you believe that your copyrighted work has been
                        copied in a way that constitutes copyright infringement,
                        please submit a notification pursuant to the Digital
                        Millennium Copyright Act (DMCA) by providing our
                        copyright agent with the required information.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-lg font-medium">4. Counter-Notice</h3>
                      <p>
                        If you believe that your content was removed or disabled
                        as a result of a mistake or misidentification, you may
                        send a counter-notice to our copyright agent.
                      </p>
                    </section>
                  </div> */}
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex items-center justify-center space-x-2 text-gray-400 text-sm">
                <Shield className="h-4 w-4" />
                <p>
                  For questions about our policies, please{" "}
                  <a
                    href="/contact-support"
                    className="text-blue-400 hover:underline"
                  >
                    contact our support team
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="bg-white dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2025 CodeContest Pro. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
