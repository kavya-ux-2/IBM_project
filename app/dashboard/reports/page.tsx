"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Users, Download, Calendar, Target } from 'lucide-react'

export default function ReportsPage() {
  // Mock data for demonstration
  const stats = {
    totalComplaints: 1247,
    resolvedComplaints: 1089,
    avgResolutionTime: 2.3,
    customerSatisfaction: 87,
    trendsUp: 12,
    trendsDown: -5
  }

  const categoryData = [
    { name: "Technical Issues", count: 456, percentage: 36.6, trend: "up" },
    { name: "Billing", count: 298, percentage: 23.9, trend: "down" },
    { name: "Service Quality", count: 234, percentage: 18.8, trend: "up" },
    { name: "Product Defects", count: 156, percentage: 12.5, trend: "stable" },
    { name: "Other", count: 103, percentage: 8.3, trend: "down" }
  ]

  const recentActivity = [
    { id: "CMP-001234", title: "Login issues with mobile app", status: "Resolved", time: "2 hours ago", priority: "High" },
    { id: "CMP-001235", title: "Billing discrepancy in invoice", status: "In Progress", time: "4 hours ago", priority: "Medium" },
    { id: "CMP-001236", title: "Product delivery delay", status: "Open", time: "6 hours ago", priority: "Low" },
    { id: "CMP-001237", title: "Website performance issues", status: "Under Review", time: "8 hours ago", priority: "Urgent" }
  ]

  const performanceGoals = [
    { metric: "Resolution Time", current: 2.3, target: 2.0, unit: "days", progress: 85 },
    { metric: "Customer Satisfaction", current: 87, target: 90, unit: "%", progress: 97 },
    { metric: "First Response Time", current: 4.2, target: 4.0, unit: "hours", progress: 95 },
    { metric: "Resolution Rate", current: 87.3, target: 85.0, unit: "%", progress: 100 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into complaint patterns and resolution performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-3xl font-bold">{stats.totalComplaints.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats.trendsUp}% from last month</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold">{stats.resolvedComplaints.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">{((stats.resolvedComplaints / stats.totalComplaints) * 100).toFixed(1)}% resolution rate</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                <p className="text-3xl font-bold">{stats.avgResolutionTime} days</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">-0.3 days improved</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-3xl font-bold">{stats.customerSatisfaction}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+3% from last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complaint Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Complaint Categories</CardTitle>
                <CardDescription>Distribution of complaints by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">{category.count}</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                      <div className="ml-4">
                        {category.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {category.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                        {category.trend === "stable" && <div className="h-4 w-4 bg-gray-300 rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest complaint updates and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.status === "Resolved" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {activity.status === "In Progress" && <Clock className="h-5 w-5 text-yellow-500" />}
                        {activity.status === "Open" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {activity.status === "Under Review" && <Users className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{activity.id}</Badge>
                          <Badge 
                            className={`text-xs ${
                              activity.priority === "Urgent" ? "bg-red-100 text-red-800" :
                              activity.priority === "High" ? "bg-orange-100 text-orange-800" :
                              activity.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }`}
                          >
                            {activity.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of complaint categories and resolution metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categoryData.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="outline">{category.count} complaints</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Volume</p>
                        <p className="font-medium">{category.percentage}% of total</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Resolution</p>
                        <p className="font-medium">{(Math.random() * 3 + 1).toFixed(1)} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Satisfaction</p>
                        <p className="font-medium">{Math.floor(Math.random() * 20 + 80)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>Track progress against key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {goal.current}{goal.unit} / {goal.target}{goal.unit}
                        </span>
                        <Target className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-gray-500">
                      {goal.progress >= 100 ? "Target achieved!" : `${(100 - goal.progress).toFixed(0)}% to target`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Historical data and trend insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Charts Coming Soon</h3>
                <p className="text-gray-500">
                  Interactive charts and historical trend analysis will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
