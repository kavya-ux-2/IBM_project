import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Mail } from 'lucide-react'

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Account Deleted Successfully</CardTitle>
          <CardDescription>
            Your account and all associated data have been permanently removed from our system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>We've successfully deleted:</p>
            <ul className="text-left space-y-1">
              <li>• Your profile and personal information</li>
              <li>• All submitted complaints and tickets</li>
              <li>• Account preferences and settings</li>
              <li>• Communication history</li>
            </ul>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
            
            <div className="text-xs text-gray-500">
              <p>Need help or have questions?</p>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
