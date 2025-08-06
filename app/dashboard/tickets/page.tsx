"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Search, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, Plus, FileText, User, Calendar, Target, Activity } from 'lucide-react'
import { ChatbotDialog } from "@/components/chatbot-dialog"

interface TicketActivity {
  id: string
  action: string
  description: string
  timestamp: string
  user: string
}

interface Ticket {
  id: string
  complaintId: string
  title: string
  description: string
  status: "Open" | "In Progress" | "Under Review" | "Resolved" | "Closed"
  priority: "Urgent" | "High" | "Medium" | "Low"
  category: string
  createdDate: string
  lastUpdate: string
  assignedTo: string
  estimatedResolution: string
  progress: number
  activities: TicketActivity[]
}

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showChatbot, setShowChatbot] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])

  // Load complaints and convert to tickets
  useEffect(() => {
    const savedComplaints = localStorage.getItem('user-complaints')
    if (savedComplaints) {
      const complaints = JSON.parse(savedComplaints)
      const generatedTickets = complaints.map((complaint: any) => ({
        id: `TKT-${complaint.id.split('-')[1]}`,
        complaintId: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        category: complaint.category,
        createdDate: complaint.date,
        lastUpdate: complaint.lastUpdate,
        assignedTo: complaint.assignedTo,
        estimatedResolution: complaint.estimatedResolution,
        progress: getProgressByStatus(complaint.status),
        activities: generateTicketActivities(complaint)
      }))
      setTickets(generatedTickets)
    }
  }, [])

  const getProgressByStatus = (status: string): number => {
    switch (status) {
      case "Open": return 10
      case "In Progress": return 50
      case "Under Review": return 75
      case "Resolved": return 100
      case "Closed": return 100
      default: return 0
    }
  }

  const generateTicketActivities = (complaint: any): TicketActivity[] => {
    const activities: TicketActivity[] = [
      {
        id: "1",
        action: "Created",
        description: "Ticket created from complaint submission",
        timestamp: complaint.date,
        user: "System"
      }
    ]

    if (complaint.status !== "Open") {
      activities.push({
        id: "2",
        action: "Assigned",
        description: `Ticket assigned to ${complaint.assignedTo}`,
        timestamp: complaint.date,
        user: "AI System"
      })
    }

    if (complaint.status === "In Progress") {
      activities.push({
        id: "3",
        action: "In Progress",
        description: "Work started on resolving the issue",
        timestamp: complaint.lastUpdate,
        user: complaint.assignedTo
      })
    }

    if (complaint.status === "Under Review") {
      activities.push({
        id: "3",
        action: "In Progress",
        description: "Work started on resolving the issue",
        timestamp: complaint.date,
        user: complaint.assignedTo
      },
      {
        id: "4",
        action: "Under Review",
        description: "Solution implemented, under review",
        timestamp: complaint.lastUpdate,
        user: complaint.assignedTo
      })
    }

    if (complaint.status === "Resolved") {
      activities.push({
        id: "3",
        action: "In Progress",
        description: "Work started on resolving the issue",
        timestamp: complaint.date,
        user: complaint.assignedTo
      },
      {
        id: "4",
        action: "Under Review",
        description: "Solution implemented, under review",
        timestamp: complaint.date,
        user: complaint.assignedTo
      },
      {
        id: "5",
        action: "Resolved",
        description: "Issue has been successfully resolved",
        timestamp: complaint.lastUpdate,
        user: complaint.assignedTo
      })
    }

    return activities
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertCircle className="h-4 w-4 text-red-500" />
      case "In Progress": return <Clock className="h-4 w-4 text-yellow-500" />
      case "Under Review": return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "Resolved": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Closed": return <CheckCircle className="h-4 w-4 text-gray-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800 border-red-200"
      case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Under Review": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved": return "bg-green-100 text-green-800 border-green-200"
      case "Closed": return "bg-gray-100 text-gray-800 border-gray-200"
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

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.complaintId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Calculate stats
  const openCount = tickets.filter(t => t.status === "Open").length
  const inProgressCount = tickets.filter(t => t.status === "In Progress").length
  const underReviewCount = tickets.filter(t => t.status === "Under Review").length
  const resolvedCount = tickets.filter(t => t.status === "Resolved").length

  const handleComplaintCreated = (newComplaint: any) => {
    // Refresh tickets when new complaint is created
    const savedComplaints = localStorage.getItem('user-complaints')
    if (savedComplaints) {
      const complaints = JSON.parse(savedComplaints)
      const generatedTickets = complaints.map((complaint: any) => ({
        id: `TKT-${complaint.id.split('-')[1]}`,
        complaintId: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        category: complaint.category,
        createdDate: complaint.date,
        lastUpdate: complaint.lastUpdate,
        assignedTo: complaint.assignedTo,
        estimatedResolution: complaint.estimatedResolution,
        progress: getProgressByStatus(complaint.status),
        activities: generateTicketActivities(complaint)
      }))
      setTickets(generatedTickets)
    }
  }

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tickets</h1>
            <p className="text-muted-foreground mt-1">Track the progress of your complaint tickets</p>
          </div>
          <Button onClick={() => setShowChatbot(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Complaint
          </Button>
        </div>

        {/* Empty State */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Tickets Available</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any tickets yet. Tickets are automatically generated when you submit complaints through our AI assistant.
            </p>
            <div className="space-y-4">
              <Button onClick={() => setShowChatbot(true)} size="lg" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Submit Your First Complaint
              </Button>
              <div className="text-sm text-muted-foreground">
                <p>When you submit a complaint, we automatically:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Generate a tracking ticket</li>
                  <li>• Assign it to the right team</li>
                  <li>• Provide real-time progress updates</li>
                  <li>• Send notifications on status changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chatbot Dialog */}
        <ChatbotDialog 
          open={showChatbot} 
          onOpenChange={setShowChatbot}
          onComplaintCreated={handleComplaintCreated}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tickets</h1>
          <p className="text-muted-foreground mt-1">Track the progress of your complaint tickets</p>
        </div>
        <Button onClick={() => setShowChatbot(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{openCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">{underReviewCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Tickets List</CardTitle>
          <CardDescription>
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{ticket.id}</p>
                      <p className="text-xs text-muted-foreground">{ticket.complaintId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate">{ticket.title}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {ticket.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{ticket.progress}%</span>
                      </div>
                      <Progress value={ticket.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {ticket.assignedTo}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {ticket.createdDate}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Ticket Details - {selectedTicket?.id}</DialogTitle>
                          <DialogDescription>
                            Complete tracking information for your ticket
                          </DialogDescription>
                        </DialogHeader>
                        {selectedTicket && (
                          <div className="space-y-6">
                            {/* Ticket Overview */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusIcon(selectedTicket.status)}
                                  <Badge className={`text-xs ${getStatusColor(selectedTicket.status)}`}>
                                    {selectedTicket.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                                <div className="mt-1">
                                  <Badge className={`text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                                    {selectedTicket.priority}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {selectedTicket.category}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
                                <div className="mt-1">
                                  <div className="flex items-center gap-2">
                                    <Progress value={selectedTicket.progress} className="h-2 flex-1" />
                                    <span className="text-sm font-medium">{selectedTicket.progress}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Ticket Information */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedTicket.assignedTo}</span>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedTicket.createdDate}</span>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Last Update</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedTicket.lastUpdate}</span>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Estimated Resolution</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedTicket.estimatedResolution}</span>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Description */}
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                              <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                                {selectedTicket.description}
                              </p>
                            </div>

                            <Separator />

                            {/* Activity Timeline */}
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Activity Timeline
                              </Label>
                              <div className="space-y-4 mt-4">
                                {selectedTicket.activities.map((activity, index) => (
                                  <div key={activity.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className={`w-3 h-3 rounded-full ${
                                        activity.action === "Resolved" ? "bg-green-500" :
                                        activity.action === "Under Review" ? "bg-blue-500" :
                                        activity.action === "In Progress" ? "bg-yellow-500" :
                                        "bg-gray-500"
                                      }`} />
                                      {index < selectedTicket.activities.length - 1 && (
                                        <div className="w-px h-8 bg-border mt-2" />
                                      )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                      <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chatbot Dialog */}
      <ChatbotDialog 
        open={showChatbot} 
        onOpenChange={setShowChatbot}
        onComplaintCreated={handleComplaintCreated}
      />
    </div>
  )
}
