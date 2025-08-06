"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Palette, Globe, Save, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    jobTitle: "Product Manager",
    bio: "Experienced product manager with a passion for user experience and innovation."
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
    securityAlerts: true
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    currency: "USD"
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,
    cookiePreferences: "essential"
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Simulate saving
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Success Alert */}
      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => handleProfileChange("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profile.jobTitle}
                    onChange={(e) => handleProfileChange("jobTitle", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Enable Two-Factor Authentication</Button>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                </div>
                <Button variant="outline" size="sm">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive important updates via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">Get weekly summary of your complaints</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive product updates and promotions</p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">Important security notifications</p>
                  <Badge variant="secondary" className="mt-1">Recommended</Badge>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize your app appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange("dateFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select value={privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="contacts">Contacts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-muted-foreground">Share anonymized data to improve our services</p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics Tracking</p>
                  <p className="text-sm text-muted-foreground">Help us improve by tracking usage analytics</p>
                </div>
                <Switch
                  checked={privacy.analyticsTracking}
                  onCheckedChange={(checked) => handlePrivacyChange("analyticsTracking", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Cookie Preferences</Label>
                <Select value={privacy.cookiePreferences} onValueChange={(value) => handlePrivacyChange("cookiePreferences", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cookies</SelectItem>
                    <SelectItem value="functional">Functional Only</SelectItem>
                    <SelectItem value="essential">Essential Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Changes to privacy settings may affect app functionality. Some features may not work properly with restricted settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your personal data and account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Download My Data</Button>
              <Button variant="outline">Delete Account</Button>
              <p className="text-sm text-muted-foreground">
                Account deletion is permanent and cannot be undone. All your data will be permanently removed.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
