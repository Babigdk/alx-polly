import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Plus, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Create and Share
          <span className="text-blue-600"> Polls</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Build engaging polls, gather insights, and make data-driven decisions with our modern polling platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/polls/create">
            <Button size="lg" className="text-lg px-8">
              <Plus className="w-5 h-5 mr-2" />
              Create Poll
            </Button>
          </Link>
          <Link href="/polls">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Browse Polls
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <div className="bg-green-100 p-3 rounded-full w-fit">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Easy Creation</CardTitle>
            <CardDescription>
              Create polls in seconds with our intuitive interface
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-purple-100 p-3 rounded-full w-fit">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Community Driven</CardTitle>
            <CardDescription>
              Share polls with your community and gather real-time feedback
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-orange-100 p-3 rounded-full w-fit">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>Real-time Results</CardTitle>
            <CardDescription>
              See results update in real-time as people vote
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Polls Preview */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Recent Polls</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What's your favorite programming language?</CardTitle>
              <CardDescription>156 votes • 2 days ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/1">
                <Button variant="outline" className="w-full">View Poll</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Best framework for web development?</CardTitle>
              <CardDescription>89 votes • 5 days ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/2">
                <Button variant="outline" className="w-full">View Poll</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Preferred database for projects?</CardTitle>
              <CardDescription>234 votes • 1 week ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/3">
                <Button variant="outline" className="w-full">View Poll</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Link href="/polls">
          <Button variant="outline">View All Polls</Button>
        </Link>
      </div>
    </div>
  )
}
