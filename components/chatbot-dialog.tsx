"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Paperclip, CheckCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "options" | "form" | "success"
  options?: string[]
}

interface ChatbotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplaintCreated?: (complaint: any) => void
}

export function ChatbotDialog({ open, onOpenChange, onComplaintCreated }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. I'm here to help you with your complaints. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "options",
      options: ["Report a new complaint", "Check complaint status", "General inquiry", "Technical support"]
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [complaintData, setComplaintData] = useState<any>({})
  const [currentStep, setCurrentStep] = useState("initial")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateComplaintId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `CMP-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`
  }

  const categorizeComplaint = (description: string) => {
    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('login') || lowerDesc.includes('password') || lowerDesc.includes('access') || lowerDesc.includes('technical') || lowerDesc.includes('bug') || lowerDesc.includes('error')) {
      return 'Technical'
    } else if (lowerDesc.includes('billing') || lowerDesc.includes('payment') || lowerDesc.includes('charge') || lowerDesc.includes('invoice')) {
      return 'Billing'
    } else if (lowerDesc.includes('service') || lowerDesc.includes('outage') || lowerDesc.includes('down') || lowerDesc.includes('slow')) {
      return 'Service'
    } else if (lowerDesc.includes('feature') || lowerDesc.includes('request') || lowerDesc.includes('suggestion')) {
      return 'Feature'
    } else {
      return 'General'
    }
  }

  const determinePriority = (description: string) => {
    const lowerDesc = description.toLowerCase()
    if (lowerDesc.includes('urgent') || lowerDesc.includes('critical') || lowerDesc.includes('outage') || lowerDesc.includes('down') || lowerDesc.includes('emergency')) {
      return 'Urgent'
    } else if (lowerDesc.includes('important') || lowerDesc.includes('asap') || lowerDesc.includes('high') || lowerDesc.includes('login') || lowerDesc.includes('payment')) {
      return 'High'
    } else if (lowerDesc.includes('medium') || lowerDesc.includes('moderate')) {
      return 'Medium'
    } else {
      return 'Low'
    }
  }

  const assignTeam = (category: string) => {
    switch (category) {
      case 'Technical': return 'Technical Support Team'
      case 'Billing': return 'Billing Department'
      case 'Service': return 'Network Operations'
      case 'Feature': return 'Product Team'
      default: return 'Customer Support'
    }
  }

  const createComplaint = (title: string, description: string) => {
    const category = categorizeComplaint(description)
    const priority = determinePriority(description)
    const currentDate = new Date().toISOString().split('T')[0]
    
    const complaint = {
      id: generateComplaintId(),
      title: title,
      description: description,
      status: "Open",
      priority: priority,
      category: category,
      date: currentDate,
      lastUpdate: currentDate,
      assignedTo: assignTeam(category),
      estimatedResolution: new Date(Date.now() + (priority === 'Urgent' ? 1 : priority === 'High' ? 2 : priority === 'Medium' ? 3 : 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    // Save to localStorage
    const existingComplaints = JSON.parse(localStorage.getItem('user-complaints') || '[]')
    const updatedComplaints = [...existingComplaints, complaint]
    localStorage.setItem('user-complaints', JSON.stringify(updatedComplaints))

    // Notify parent component
    if (onComplaintCreated) {
      onComplaintCreated(complaint)
    }

    return complaint
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(content)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const generateBotResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase()
    
    if (currentStep === "initial") {
      if (lowerInput.includes("complaint") || lowerInput.includes("report") || userInput === "Report a new complaint") {
        setCurrentStep("collecting_title")
        return {
          id: Date.now().toString(),
          content: "I'll help you file a complaint. First, could you please provide a brief title or summary of your issue?",
          sender: "bot",
          timestamp: new Date()
        }
      } else if (lowerInput.includes("status") || lowerInput.includes("check")) {
        return {
          id: Date.now().toString(),
          content: "I can help you check your complaint status. Please provide your complaint ID (e.g., CMP-001) or describe the complaint you submitted.",
          sender: "bot",
          timestamp: new Date()
        }
      } else if (lowerInput.includes("technical") || lowerInput.includes("support") || userInput === "Technical support") {
        setCurrentStep("collecting_title")
        setComplaintData({ category: "Technical" })
        return {
          id: Date.now().toString(),
          content: "I understand you need technical support. I'll categorize this as a technical issue. Please provide a brief title for your technical problem:",
          sender: "bot",
          timestamp: new Date()
        }
      } else {
        return {
          id: Date.now().toString(),
          content: "I'm here to help! Could you please tell me more about what you need assistance with?",
          sender: "bot",
          timestamp: new Date(),
          type: "options",
          options: ["Report a new complaint", "Check complaint status", "Technical support", "General inquiry"]
        }
      }
    } else if (currentStep === "collecting_title") {
      setComplaintData(prev => ({ ...prev, title: userInput }))
      setCurrentStep("collecting_description")
      return {
        id: Date.now().toString(),
        content: `Thank you! Now please provide a detailed description of the issue: "${userInput}". Include any relevant details, error messages, or steps that led to the problem.`,
        sender: "bot",
        timestamp: new Date()
      }
    } else if (currentStep === "collecting_description") {
      const complaint = createComplaint(complaintData.title, userInput)
      setCurrentStep("completed")
      
      return {
        id: Date.now().toString(),
        content: `Perfect! I've successfully created your complaint with the following details:

**Complaint ID:** ${complaint.id}
**Title:** ${complaint.title}
**Category:** ${complaint.category}
**Priority:** ${complaint.priority}
**Assigned to:** ${complaint.assignedTo}
**Estimated Resolution:** ${complaint.estimatedResolution}

Your complaint has been automatically categorized and assigned to the appropriate team. You'll receive updates as we work on resolving your issue. You can track the progress in your dashboard.`,
        sender: "bot",
        timestamp: new Date(),
        type: "success"
      }
    } else {
      return {
        id: Date.now().toString(),
        content: "Is there anything else I can help you with today?",
        sender: "bot",
        timestamp: new Date(),
        type: "options",
        options: ["Report another complaint", "Check complaint status", "Close chat"]
      }
    }
  }

  const handleOptionClick = (option: string) => {
    if (option === "Close chat") {
      onOpenChange(false)
      // Reset state
      setCurrentStep("initial")
      setComplaintData({})
      setMessages([{
        id: "1",
        content: "Hello! I'm your AI assistant. I'm here to help you with your complaints. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "options",
        options: ["Report a new complaint", "Check complaint status", "General inquiry", "Technical support"]
      }])
      return
    } else if (option === "Report another complaint") {
      setCurrentStep("initial")
      setComplaintData({})
    }
    handleSendMessage(option)
  }

  const handleDialogClose = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      // Reset state when dialog closes
      setCurrentStep("initial")
      setComplaintData({})
      setMessages([{
        id: "1",
        content: "Hello! I'm your AI assistant. I'm here to help you with your complaints. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "options",
        options: ["Report a new complaint", "Check complaint status", "General inquiry", "Technical support"]
      }])
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
            <Badge variant="secondary" className="ml-auto">
              Online
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : message.type === "success"
                      ? "bg-green-50 text-green-900 border border-green-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.type === "success" && (
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Complaint Created Successfully!</span>
                    </div>
                  )}
                  
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2 bg-white hover:bg-gray-50"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputValue)
                }
              }}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
