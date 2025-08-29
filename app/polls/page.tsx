import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "A survey to understand developer preferences",
    totalVotes: 156,
    createdAt: "2024-01-15",
    options: ["JavaScript", "Python", "TypeScript", "Rust"]
  },
  {
    id: "2",
    title: "Best framework for web development",
    description: "Which framework do you prefer for building web applications?",
    totalVotes: 89,
    createdAt: "2024-01-10",
    options: ["React", "Vue", "Angular", "Svelte"]
  },
  {
    id: "3",
    title: "Preferred database for projects",
    description: "What database technology do you use most often?",
    totalVotes: 234,
    createdAt: "2024-01-05",
    options: ["PostgreSQL", "MongoDB", "MySQL", "Redis"]
  }
]

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-gray-600">Discover and participate in polls</p>
        </div>
        <Link href="/polls/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {poll.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {poll.totalVotes} votes
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {poll.createdAt}
                </div>
                <div className="pt-2">
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
    </div>
  )
}
