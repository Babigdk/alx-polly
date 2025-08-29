import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Share2 } from "lucide-react"

// Mock data for demonstration
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "A survey to understand developer preferences and help guide future technology decisions in our community.",
  totalVotes: 156,
  createdAt: "2024-01-15",
  options: [
    { id: "1", text: "JavaScript", votes: 45, percentage: 28.8 },
    { id: "2", text: "Python", votes: 38, percentage: 24.4 },
    { id: "3", text: "TypeScript", votes: 42, percentage: 26.9 },
    { id: "4", text: "Rust", votes: 31, percentage: 19.9 }
  ]
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{mockPoll.title}</h1>
        <p className="text-gray-600 mb-4">{mockPoll.description}</p>
        
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {mockPoll.totalVotes} votes
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {mockPoll.createdAt}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vote</CardTitle>
            <CardDescription>
              Select your preferred option
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockPoll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="font-medium">{option.text}</div>
                  </div>
                </Button>
              </div>
            ))}
            <Button className="w-full mt-6">
              Submit Vote
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Current voting results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockPoll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-gray-500">
                    {option.votes} votes ({option.percentage}%)
                  </span>
                </div>
                <Progress value={option.percentage} className="h-2" />
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Poll
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
