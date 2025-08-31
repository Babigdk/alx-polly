'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Poll, VoteResult, submitVote, getVoteResults } from "@/lib/actions/polls"

interface PollVotingComponentProps {
  poll: Poll
}



export default function PollVotingComponent({ poll }: PollVotingComponentProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [voteResults, setVoteResults] = useState<VoteResult[]>([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch vote results
  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        const results = await getVoteResults(poll.id)
        setVoteResults(results)
      } catch (error) {
        console.error('Error fetching vote results:', error)
      }
    }
    
    fetchVoteResults()
  }, [poll.id])

  const handleVote = async () => {
    if (selectedOption === null) {
      setError("Please select an option to vote")
      return
    }

    setIsVoting(true)
    setError(null)

    try {
      await submitVote(poll.id, selectedOption)
      
      setHasVoted(true)
      // Refresh vote results
      const newResults = await getVoteResults(poll.id)
      setVoteResults(newResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote")
    } finally {
      setIsVoting(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/polls/${poll.id}`
    try {
      await navigator.clipboard.writeText(url)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Vote</CardTitle>
          <CardDescription>
            Select your preferred option
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {poll.options.map((option, index) => (
            <div key={index} className="space-y-2">
              <Button
                variant={selectedOption === index ? "default" : "outline"}
                className={`w-full justify-start h-auto p-4 transition-all duration-200 ${
                  selectedOption === index 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg" 
                    : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-0 shadow-sm hover:shadow-md"
                }`}
                onClick={() => setSelectedOption(index)}
                disabled={hasVoted}
              >
                <div className="text-left">
                  <div className="font-medium">{option}</div>
                </div>
              </Button>
            </div>
          ))}
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {!hasVoted ? (
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={handleVote}
              disabled={isVoting || selectedOption === null}
            >
              {isVoting ? "Submitting..." : "Submit Vote"}
            </Button>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md mt-6">
              <p className="text-sm text-green-600 text-center">
                ✓ Your vote has been submitted!
              </p>
            </div>
          )}
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
          {voteResults.map((result) => (
            <div key={result.optionIndex} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{poll.options[result.optionIndex]}</span>
                <span className="text-gray-500">
                  {result.votes} votes ({result.percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={result.percentage} className="h-2" />
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Poll
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
