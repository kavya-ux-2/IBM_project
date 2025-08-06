"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Ticket, Clock, CheckCircle, AlertCircle, TrendingUp, Plus, FileText } from 'lucide-react'
import { ChatbotDialog } from "@/components/chatbot-dialog"

export default function DashboardPage() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [complaints, setComplaints] = useState<any[]>([])

  // Load complaints from localStorage on component mount
  useEffect(() => {
    const savedComplaints = localStorage.getItem('user-complaints')
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints))
    }
  }, [])

  // Calculate stats based on actual complaints
  const totalComplaints = complaints.length
  const openComplaints = complaints.filter(c => c.status === "Open").length
  const inProgressComplaints = complaints.filter(c => c.status === "In Progress").length
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length

  const stats = [
    {
      title: "Total Complaints",
      value: totalComplaints.toString(),
      change: totalComplaints > 0 ? "+100%" : "0%",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Open Tickets",
      value: openComplaints.toString(),
      change: "0%",
      icon: Ticket,
      color: "text-orange-600"
    },
    {
      title: "In Progress",
      value: inProgressComplaints.toString(),
      change: "0%",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Resolved",
      value: resolvedComplaints.toString(),
      change: resolvedComplaints > 0 ? "+100%" : "0%",
      icon: CheckCircle,
      color: "text-green-600"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800 border-red-200"
      case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Under Review": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800 border-red-200"
      case "High": return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleComplaintCreated = (newComplaint: any) => {
    const updatedComplaints = [...complaints, newComplaint]
    setComplaints(updatedComplaints)
    localStorage.setItem('user-complaints', JSON.stringify(updatedComplaints))
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {totalComplaints === 0 
              ? "Welcome! Start by submitting your first complaint." 
              : "Welcome back! Here's your complaint overview."
            }
          </p>
        </div>
        <Button onClick={() => setShowChatbot(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      {totalComplaints === 0 ? (
        // Empty State
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No Complaints Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't submitted any complaints yet. Our AI assistant is ready to help you file your first complaint and get it resolved quickly.
              </p>
              <Button onClick={() => setShowChatbot(true)} size="lg" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Submit Your First Complaint
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Existing Content with Data
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Your latest complaint submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.slice(0, 4).map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{complaint.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {complaint.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{complaint.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{complaint.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Progress */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Resolution Progress</CardTitle>
              <CardDescription>Track your complaint resolution rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Resolution Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0}%
                  </span>
                </div>
                <Progress value={totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="text-sm text-muted-foreground">
                    {totalComplaints > 0 ? "2.4 hours" : "N/A"}
                  </span>
                </div>
                <Progress value={totalComplaints > 0 ? 80 : 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-muted-foreground">
                    {totalComplaints > 0 ? "4.2/5" : "N/A"}
                  </span>
                </div>
                <Progress value={totalComplaints > 0 ? 84 : 0} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {openComplaints > 0 
                      ? `${openComplaints} complaint${openComplaints !== 1 ? 's' : ''} require${openComplaints === 1 ? 's' : ''} attention`
                      : "No complaints require immediate attention"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chatbot Dialog */}
      <ChatbotDialog 
        open={showChatbot} 
        onOpenChange={setShowChatbot}
        onComplaintCreated={handleComplaintCreated}
      />
    </div>
  )
}
