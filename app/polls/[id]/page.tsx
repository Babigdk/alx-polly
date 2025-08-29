import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Share2, CheckCircle, Edit, Trash2 } from "lucide-react"
import { getPoll } from "@/lib/actions/polls"
import { notFound } from "next/navigation"
import PollVotingComponent from "@/components/PollVotingComponent"
import PollActions from "@/components/PollActions"

interface PageProps {
  params: { id: string }
  searchParams: { updated?: string }
}

export default async function PollDetailPage({ params, searchParams }: PageProps) {
  const poll = await getPoll(params.id)
  
  if (!poll) {
    notFound()
  }

  const showUpdateMessage = searchParams.updated === 'true'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {showUpdateMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Poll updated successfully!</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{poll.question}</h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {poll.total_votes || 0} votes
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(poll.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Show edit/delete buttons for poll owner */}
          <PollActions poll={poll} />
        </div>
      </div>

      <PollVotingComponent poll={poll} />
    </div>
  )
}

