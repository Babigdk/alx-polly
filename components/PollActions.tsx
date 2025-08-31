'use client'

import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { deletePoll } from "@/lib/actions/polls"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PollActionsProps {
  poll: {
    id: string
    question: string
  }
}

export default function PollActions({ poll }: PollActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePoll(poll.id)
      setShowDeleteConfirm(false)
      // The page will be revalidated automatically
    } catch (error) {
      console.error('Error deleting poll:', error)
      alert('Failed to delete poll. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-1">
      <Link href={`/polls/${poll.id}/edit`}>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Poll</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{poll.question}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
