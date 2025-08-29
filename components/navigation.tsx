'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Plus, Home, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export function Navigation() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">PollApp</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link href="/polls" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <BarChart3 className="w-4 h-4" />
                <span>Polls</span>
              </Link>
              {user && (
                <Link href="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/polls/create">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Create Poll
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
