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
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, Plus, FileText } from 'lucide-react'
import { ChatbotDialog } from "@/components/chatbot-dialog"

export default function ComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showChatbot, setShowChatbot] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [complaints, setComplaints] = useState<any[]>([])

  // Load complaints from localStorage on component mount
  useEffect(() => {
    const savedComplaints = localStorage.getItem('user-complaints')
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints))
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertCircle className="h-4 w-4 text-red-500" />
      case "In Progress": return <Clock className="h-4 w-4 text-yellow-500" />
      case "Under Review": return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "Resolved": return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800"
      case "In Progress": return "bg-yellow-100 text-yellow-800"
      case "Under Review": return "bg-blue-100 text-blue-800"
      case "Resolved": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800"
      case "High": return "bg-orange-100 text-orange-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Calculate stats
  const openCount = complaints.filter(c => c.status === "Open").length
  const inProgressCount = complaints.filter(c => c.status === "In Progress").length
  const underReviewCount = complaints.filter(c => c.status === "Under Review").length
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length

  const handleComplaintCreated = (newComplaint: any) => {
    const updatedComplaints = [...complaints, newComplaint]
    setComplaints(updatedComplaints)
    localStorage.setItem('user-complaints', JSON.stringify(updatedComplaints))
  }

  if (complaints.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
            <p className="text-gray-600 mt-1">Track and manage all your submitted complaints</p>
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Complaints Submitted</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't submitted any complaints yet. Our AI-powered system is ready to help you resolve any issues quickly and efficiently.
            </p>
            <div className="space-y-4">
              <Button onClick={() => setShowChatbot(true)} size="lg" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Submit Your First Complaint
              </Button>
              <div className="text-sm text-gray-500">
                <p>Our AI assistant will help you:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Categorize your complaint automatically</li>
                  <li>• Assign appropriate priority level</li>
                  <li>• Route to the right team</li>
                  <li>• Provide real-time status updates</li>
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
          <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-1">Track and manage all your submitted complaints</p>
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
                <p className="text-sm font-medium text-gray-600">Open</p>
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
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
                <p className="text-sm font-medium text-gray-600">Under Review</p>
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
                <p className="text-sm font-medium text-gray-600">Resolved</p>
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search complaints..."
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

      {/* Complaints Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Complaints List</CardTitle>
          <CardDescription>
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate">{complaint.title}</p>
                      <p className="text-sm text-gray-500 truncate">{complaint.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {complaint.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {complaint.date}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Complaint Details - {selectedComplaint?.id}</DialogTitle>
                          <DialogDescription>
                            Complete information about your complaint
                          </DialogDescription>
                        </DialogHeader>
                        {selectedComplaint && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Status</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusIcon(selectedComplaint.status)}
                                  <Badge className={`text-xs ${getStatusColor(selectedComplaint.status)}`}>
                                    {selectedComplaint.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Priority</Label>
                                <div className="mt-1">
                                  <Badge className={`text-xs ${getPriorityColor(selectedComplaint.priority)}`}>
                                    {selectedComplaint.priority}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Category</Label>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {selectedComplaint.category}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Assigned To</Label>
                                <p className="text-sm mt-1">{selectedComplaint.assignedTo}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Description</Label>
                              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                                {selectedComplaint.description}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Submitted Date</Label>
                                <p className="text-sm mt-1">{selectedComplaint.date}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Last Update</Label>
                                <p className="text-sm mt-1">{selectedComplaint.lastUpdate}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Estimated Resolution</Label>
                              <p className="text-sm mt-1">{selectedComplaint.estimatedResolution}</p>
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
