"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal, User, MessageSquare, FileText, BarChart3, HelpCircle, Bell, LogOut, UserCircle, Settings } from 'lucide-react'

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Complaint Management",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Support Team",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Customer Success",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Complaints",
      url: "/dashboard/complaints",
      icon: MessageSquare,
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: FileText,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ],
  projects: [
    {
      name: "Recent Complaints",
      url: "/dashboard/complaints",
      icon: Frame,
    },
    {
      name: "Analytics Dashboard",
      url: "/dashboard/reports",
      icon: PieChart,
    },
    {
      name: "User Management",
      url: "/dashboard/settings",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Clear all stored data
      localStorage.clear()
      sessionStorage.clear()
      
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-1.5 text-left text-sm"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {data.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 text-left text-sm">
                  <span className="truncate font-semibold">{data.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {data.user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => router.push('/dashboard/account')}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault()
                  setShowLogoutDialog(true)
                }}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
