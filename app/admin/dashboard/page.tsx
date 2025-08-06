"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Activity, UserCheck } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Complaints",
      value: "156",
      change: "-8.2%",
      trend: "down",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      title: "Open Tickets",
      value: "89",
      change: "-15.3%",
      trend: "down",
      icon: Ticket,
      color: "text-red-600"
    },
    {
      title: "Avg Resolution Time",
      value: "2.4h",
      change: "-22.1%",
      trend: "down",
      icon: Clock,
      color: "text-green-600"
    }
  ]

  const chartData = [
    { name: 'Jan', complaints: 65, resolved: 58 },
    { name: 'Feb', complaints: 78, resolved: 72 },
    { name: 'Mar', complaints: 90, resolved: 85 },
    { name: 'Apr', complaints: 81, resolved: 79 },
    { name: 'May', complaints: 95, resolved: 88 },
    { name: 'Jun', complaints: 87, resolved: 84 },
  ]

  const categoryData = [
    { name: 'Technical', value: 35, color: '#3B82F6' },
    { name: 'Billing', value: 25, color: '#EF4444' },
    { name: 'Service', value: 20, color: '#10B981' },
    { name: 'Feature', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ]

  const recentTickets = [
    {
      id: "TKT-001",
      complaint: "CMP-045",
      title: "Payment Gateway Error",
      priority: "Urgent",
      assignedTo: "John Smith",
      status: "In Progress",
      created: "2 hours ago"
    },
    {
      id: "TKT-002",
      complaint: "CMP-046",
      title: "Mobile App Crash",
      priority: "High",
      assignedTo: "Sarah Johnson",
      status: "Open",
      created: "4 hours ago"
    },
    {
      id: "TKT-003",
      complaint: "CMP-047",
      title: "Account Access Issue",
      priority: "Medium",
      assignedTo: "Mike Davis",
      status: "Under Review",
      created: "6 hours ago"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800"
      case "High": return "bg-orange-100 text-orange-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and manage complaint resolution system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                    )}
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Complaints Trend</CardTitle>
            <CardDescription>Monthly complaints vs resolutions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest ticket assignments and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{ticket.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {ticket.complaint}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Assigned to {ticket.assignedTo} • {ticket.created}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Resolution Rate</span>
                <span className="text-sm text-gray-600">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm text-gray-600">4.3/5</span>
              </div>
              <Progress value={86} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">First Response Time</span>
                <span className="text-sm text-gray-600">1.2h avg</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Team Utilization</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Activity className="h-4 w-4" />
                <span>12 agents currently active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <UserCheck className="h-6 w-6" />
              <span>Assign Tickets</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Escalate Issues</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Bulk Resolve</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
