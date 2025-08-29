import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { getUserPolls } from "@/lib/actions/polls"
import { notFound } from "next/navigation"
import PollActions from "@/components/PollActions"

export default async function DashboardPage() {
  let userPolls
  try {
    userPolls = await getUserPolls()
  } catch (error) {
    console.error('Error fetching user polls:', error)
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600">Manage your polls and track their performance</p>
        </div>
        <Link href="/polls/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Poll
          </Button>
        </Link>
      </div>

      {userPolls.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
          <p className="text-gray-600 mb-6">Create your first poll to get started!</p>
          <Link href="/polls/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Poll
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPolls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{poll.question}</CardTitle>
                    <CardDescription>
                      {poll.options.length} options available
                    </CardDescription>
                  </div>
                  <PollActions poll={poll} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {poll.total_votes || 0} votes
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(poll.created_at).toLocaleDateString()}
                  </div>
                  <div className="pt-2 space-y-2">
                    <Link href={`/polls/${poll.id}`}>
                      <Button variant="outline" className="w-full">
                        View Poll
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
