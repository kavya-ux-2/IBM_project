"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mail, MessageSquare, Phone, CheckCircle, AlertTriangle, Info, Settings, Clock, User } from 'lucide-react'

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
    securityAlerts: true,
    complaintUpdates: true,
    ticketAssignments: true,
    resolutionNotices: true,
    systemMaintenance: true
  })

  const [saved, setSaved] = useState(false)

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const recentNotifications = [
    {
      id: 1,
      type: "success",
      title: "Complaint Resolved",
      message: "Your complaint CMP-001 has been successfully resolved",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "info",
      title: "Ticket Update",
      message: "TKT-001 status changed to 'In Progress'",
      time: "4 hours ago",
      read: true
    },
    {
      id: 3,
      type: "warning",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 2-4 AM EST",
      time: "1 day ago",
      read: true
    },
    {
      id: 4,
      type: "info",
      title: "New Feature Available",
      message: "Enhanced AI assistant is now available",
      time: "2 days ago",
      read: true
    },
    {
      id: 5,
      type: "success",
      title: "Account Verified",
      message: "Your email address has been verified",
      time: "3 days ago",
      read: true
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info": return <Info className="h-4 w-4 text-blue-600" />
      default: return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "border-l-green-500 bg-green-50"
      case "warning": return "border-l-yellow-500 bg-yellow-50"
      case "info": return "border-l-blue-500 bg-blue-50"
      default: return "border-l-gray-500 bg-gray-50"
    }
  }

  const unreadCount = recentNotifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage your notification preferences and view recent alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Notification preferences saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Recent Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Recent Notifications Tab */}
        <TabsContent value="recent" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Mark All as Read</Button>
              <Button variant="outline" size="sm">Clear All</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {notification.read ? "Mark Unread" : "Mark Read"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Configure what you receive via email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Complaint Updates</p>
                    <p className="text-sm text-muted-foreground">Status changes and progress updates</p>
                  </div>
                  <Switch
                    checked={preferences.complaintUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange("complaintUpdates", checked)}
                    disabled={!preferences.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Resolution Notices</p>
                    <p className="text-sm text-muted-foreground">When complaints are resolved</p>
                  </div>
                  <Switch
                    checked={preferences.resolutionNotices}
                    onCheckedChange={(checked) => handlePreferenceChange("resolutionNotices", checked)}
                    disabled={!preferences.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Summary of your complaint activity</p>
                  </div>
                  <Switch
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                    disabled={!preferences.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Product updates and promotions</p>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                    disabled={!preferences.emailNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Push & SMS Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Push & SMS Notifications
                </CardTitle>
                <CardDescription>Instant notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser notifications</p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Text message alerts</p>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ticket Assignments</p>
                    <p className="text-sm text-muted-foreground">When tickets are assigned to agents</p>
                  </div>
                  <Switch
                    checked={preferences.ticketAssignments}
                    onCheckedChange={(checked) => handlePreferenceChange("ticketAssignments", checked)}
                    disabled={!preferences.pushNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Maintenance</p>
                    <p className="text-sm text-muted-foreground">Scheduled maintenance alerts</p>
                  </div>
                  <Switch
                    checked={preferences.systemMaintenance}
                    onCheckedChange={(checked) => handlePreferenceChange("systemMaintenance", checked)}
                    disabled={!preferences.pushNotifications}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">SMS Frequency</label>
                  <Select defaultValue="urgent" disabled={!preferences.smsNotifications}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="important">Important Only</SelectItem>
                      <SelectItem value="urgent">Urgent Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security & System Alerts
              </CardTitle>
              <CardDescription>Important security and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Security alerts are always enabled and cannot be disabled for your account protection.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">Login attempts, password changes, etc.</p>
                  <Badge variant="secondary" className="mt-1">Always Enabled</Badge>
                </div>
                <Switch
                  checked={preferences.securityAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange("securityAlerts", checked)}
                  disabled
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notification Timing</label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quiet Hours</label>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Quiet Hours</SelectItem>
                      <SelectItem value="night">10 PM - 8 AM</SelectItem>
                      <SelectItem value="custom">Custom Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
