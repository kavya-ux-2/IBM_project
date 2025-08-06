import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, MessageSquare, BarChart3, Shield, Zap, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Bot className="h-6 w-6 mr-2 text-blue-600" />
          <span className="font-bold text-xl">ComplaintAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
        </nav>
        <div className="ml-4 flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">
                  AI-Powered Complaint Management
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Customer Complaints into
                  <span className="text-blue-600"> Opportunities</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your complaint management process with AI-powered insights, automated workflows, and comprehensive analytics.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">View Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mt-4">
                Everything you need to manage complaints efficiently and improve customer satisfaction.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Smart Complaint Tracking</CardTitle>
                  <CardDescription>
                    Automatically categorize and prioritize complaints using AI-powered analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Automatic categorization</li>
                    <li>• Priority scoring</li>
                    <li>• Real-time status updates</li>
                    <li>• Multi-channel integration</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Get deep insights into complaint patterns and resolution performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Comprehensive dashboards</li>
                    <li>• Trend analysis</li>
                    <li>• Performance metrics</li>
                    <li>• Custom reports</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bot className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Leverage AI to suggest solutions and automate routine responses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Intelligent suggestions</li>
                    <li>• Automated responses</li>
                    <li>• Sentiment analysis</li>
                    <li>• Knowledge base integration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose ComplaintAI?
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Faster Resolution</h3>
                <p className="text-gray-500">
                  Reduce complaint resolution time by up to 60% with automated workflows and AI assistance.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Better Customer Experience</h3>
                <p className="text-gray-500">
                  Improve customer satisfaction with faster responses and more effective solutions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-gray-500">
                  Keep your data secure with enterprise-grade security and compliance features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Complaint Management?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                  Join thousands of companies already using ComplaintAI to improve their customer service.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 ComplaintAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
