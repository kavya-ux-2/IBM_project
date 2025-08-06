"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageCircle, Book, Video, Phone, Mail, ExternalLink, HelpCircle, FileText, Users, Zap } from 'lucide-react'

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqData = [
    {
      question: "How do I submit a complaint?",
      answer: "You can submit a complaint by clicking the 'New Complaint' button on your dashboard or complaints page. Our AI assistant will guide you through the process, automatically categorizing and prioritizing your issue."
    },
    {
      question: "How long does it take to resolve a complaint?",
      answer: "Resolution times vary based on the complexity and priority of your complaint. Urgent issues are typically resolved within 24 hours, while standard complaints may take 3-5 business days. You can track progress in real-time on your tickets page."
    },
    {
      question: "Can I update my complaint after submitting it?",
      answer: "Yes, you can add additional information to your complaint by contacting our support team or through the ticket tracking system. Any updates will be logged in your ticket's activity timeline."
    },
    {
      question: "How do I check the status of my complaint?",
      answer: "You can check your complaint status on the 'My Complaints' or 'My Tickets' pages. Each complaint shows real-time status updates, progress tracking, and estimated resolution times."
    },
    {
      question: "What information should I include in my complaint?",
      answer: "Include as much detail as possible: describe the issue clearly, provide steps to reproduce the problem, include any error messages, and mention when the issue started. Our AI will help categorize and prioritize based on this information."
    },
    {
      question: "Can I escalate my complaint if I'm not satisfied?",
      answer: "Yes, if you're not satisfied with the resolution, you can request escalation through your ticket page or by contacting our support team directly. Escalated complaints are reviewed by senior staff."
    },
    {
      question: "How do I change my notification preferences?",
      answer: "Go to Settings > Notifications to customize how you receive updates about your complaints. You can choose email, SMS, or push notifications based on your preferences."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use enterprise-grade security measures to protect your data. All communications are encrypted, and we comply with industry standards for data protection. You can review our privacy policy for more details."
    }
  ]

  const tutorials = [
    {
      title: "Getting Started with ComplaintAI",
      description: "Learn the basics of using our AI-powered complaint management system",
      duration: "5 min",
      type: "video"
    },
    {
      title: "How to Submit Your First Complaint",
      description: "Step-by-step guide to submitting and tracking complaints",
      duration: "3 min",
      type: "article"
    },
    {
      title: "Understanding Ticket Statuses",
      description: "Learn what each status means and how to track progress",
      duration: "4 min",
      type: "article"
    },
    {
      title: "Using the AI Assistant Effectively",
      description: "Tips for getting the best results from our AI chatbot",
      duration: "6 min",
      type: "video"
    },
    {
      title: "Managing Notifications and Settings",
      description: "Customize your experience and notification preferences",
      duration: "3 min",
      type: "article"
    }
  ]

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our AI assistant or human agents",
      icon: MessageCircle,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      icon: Mail,
      action: "Send Email",
      available: "support@complaintai.com"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: Phone,
      action: "Call Now",
      available: "Mon-Fri 9AM-6PM"
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share experiences",
      icon: Users,
      action: "Visit Forum",
      available: "24/7"
    }
  ]

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to your questions and get the support you need
        </p>
        
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Submit a Complaint</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new complaint with our AI assistant
            </p>
            <Button size="sm">Get Started</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Track Your Tickets</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor the progress of your complaints
            </p>
            <Button size="sm" variant="outline">View Tickets</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get help from our support team
            </p>
            <Button size="sm" variant="outline">Contact Us</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                {searchQuery ? `${filteredFAQs.length} results found` : "Common questions and answers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tutorials & Guides</CardTitle>
              <CardDescription>Step-by-step guides to help you get the most out of ComplaintAI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {tutorial.type === "video" ? (
                          <Video className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Book className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {tutorial.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <option.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{option.available}</span>
                        <Button size="sm">{option.action}</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of our services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Assistant</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ticket System</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dashboard</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Comprehensive guides and API documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  User Guide
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  API Documentation
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Best Practices
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
                <CardDescription>Connect with other users and get help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Community Forum
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discord Server
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Webinars
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Release Notes</CardTitle>
              <CardDescription>Stay updated with the latest features and improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">Version 2.1.0</h4>
                    <Badge variant="secondary">Latest</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Released on January 15, 2024</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Enhanced AI assistant with better categorization</li>
                    <li>• Improved ticket tracking with real-time updates</li>
                    <li>• New notification preferences</li>
                  </ul>
                </div>
                <div className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium mb-1">Version 2.0.5</h4>
                  <p className="text-sm text-muted-foreground mb-2">Released on December 20, 2023</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Bug fixes and performance improvements</li>
                    <li>• Updated security measures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
