'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface CreatePollData {
  question: string
  options: string[]
}

export interface Poll {
  id: string
  question: string
  options: string[]
  created_at: string
  user_id: string
  total_votes?: number
}

export interface VoteResult {
  optionIndex: number
  votes: number
  percentage: number
}

export async function createPoll(formData: CreatePollData) {
  const supabase = await createServerSupabaseClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to create a poll')
  }

  // Validate the data
  if (!formData.question || formData.question.trim().length < 5) {
    throw new Error('Question must be at least 5 characters long')
  }

  if (!formData.options || formData.options.length < 2) {
    throw new Error('At least 2 options are required')
  }

  // Filter out empty options and trim whitespace
  const validOptions = formData.options
    .map(option => option.trim())
    .filter(option => option.length > 2)

  if (validOptions.length < 2) {
    throw new Error('At least 2 valid options are required (minimum 3 characters each)')
  }

  if (validOptions.length > 10) {
    throw new Error('Maximum 10 options allowed')
  }

  try {
    const { data: poll, error } = await supabase
      .from('polls')
      .insert({
        user_id: user.id,
        question: formData.question.trim(),
        options: validOptions
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating poll:', error)
      throw new Error('Failed to create poll')
    }

    // Revalidate the polls page and redirect to polls listing with success message
    revalidatePath('/polls')
    redirect('/polls?success=true')
  } catch (error) {
    console.error('Error in createPoll:', error)
    throw error
  }
}

export async function getPolls(): Promise<Poll[]> {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        options,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching polls:', error)
      throw new Error('Failed to fetch polls')
    }

    // Get vote counts for each poll
    const pollsWithVotes = await Promise.all(
      (polls || []).map(async (poll) => {
        const { count } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('poll_id', poll.id)
        
        return {
          ...poll,
          total_votes: count || 0
        }
      })
    )

    return pollsWithVotes
  } catch (error) {
    console.error('Error in getPolls:', error)
    throw error
  }
}

export async function getUserPolls(): Promise<Poll[]> {
  const supabase = await createServerSupabaseClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to view your polls')
  }

  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        options,
        created_at,
        user_id
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user polls:', error)
      throw new Error('Failed to fetch user polls')
    }

    // Get vote counts for each poll
    const pollsWithVotes = await Promise.all(
      (polls || []).map(async (poll) => {
        const { count } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('poll_id', poll.id)
        
        return {
          ...poll,
          total_votes: count || 0
        }
      })
    )

    return pollsWithVotes
  } catch (error) {
    console.error('Error in getUserPolls:', error)
    throw error
  }
}

export async function getPoll(id: string): Promise<Poll | null> {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        options,
        created_at,
        user_id
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Poll not found
      }
      console.error('Error fetching poll:', error)
      throw new Error('Failed to fetch poll')
    }

    // Get vote count for this poll
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', poll.id)

    return {
      ...poll,
      total_votes: count || 0
    }
  } catch (error) {
    console.error('Error in getPoll:', error)
    throw error
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to delete a poll')
  }

  try {
    // First, check if the poll exists and belongs to the user
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('user_id')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    if (poll.user_id !== user.id) {
      throw new Error('You can only delete your own polls')
    }

    // Delete the poll (votes will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (deleteError) {
      console.error('Error deleting poll:', deleteError)
      throw new Error('Failed to delete poll')
    }

    // Revalidate the dashboard and polls pages
    revalidatePath('/dashboard')
    revalidatePath('/polls')
  } catch (error) {
    console.error('Error in deletePoll:', error)
    throw error
  }
}

export async function updatePoll(pollId: string, formData: CreatePollData): Promise<void> {
  const supabase = await createServerSupabaseClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to update a poll')
  }

  // Validate the data
  if (!formData.question || formData.question.trim().length < 5) {
    throw new Error('Question must be at least 5 characters long')
  }

  if (!formData.options || formData.options.length < 2) {
    throw new Error('At least 2 options are required')
  }

  // Filter out empty options and trim whitespace
  const validOptions = formData.options
    .map(option => option.trim())
    .filter(option => option.length > 2)

  if (validOptions.length < 2) {
    throw new Error('At least 2 valid options are required (minimum 3 characters each)')
  }

  if (validOptions.length > 10) {
    throw new Error('Maximum 10 options allowed')
  }

  try {
    // First, check if the poll exists and belongs to the user
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('user_id')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    if (poll.user_id !== user.id) {
      throw new Error('You can only update your own polls')
    }

    // Update the poll
    const { error: updateError } = await supabase
      .from('polls')
      .update({
        question: formData.question.trim(),
        options: validOptions
      })
      .eq('id', pollId)

    if (updateError) {
      console.error('Error updating poll:', updateError)
      throw new Error('Failed to update poll')
    }

    // Revalidate the dashboard and polls pages
    revalidatePath('/dashboard')
    revalidatePath('/polls')
    revalidatePath(`/polls/${pollId}`)
  } catch (error) {
    console.error('Error in updatePoll:', error)
    throw error
  }
}

export async function submitVote(pollId: string, optionIndex: number): Promise<void> {
  const supabase = await createServerSupabaseClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('You must be logged in to vote')
  }

  try {
    // First, check if the poll exists and validate the option index
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('options')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new Error('Invalid option selected')
    }

    // Insert the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        user_id: user.id,
        option_index: optionIndex
      })

    if (voteError) {
      if (voteError.code === '23505') {
        throw new Error('You have already voted on this poll')
      }
      console.error('Error submitting vote:', voteError)
      throw new Error('Failed to submit vote')
    }

    // Revalidate the poll page
    revalidatePath(`/polls/${pollId}`)
  } catch (error) {
    console.error('Error in submitVote:', error)
    throw error
  }
}

export async function getVoteResults(pollId: string): Promise<VoteResult[]> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Get the poll to know how many options there are
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('options')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    // Get vote counts for each option
    const results = await Promise.all(
      poll.options.map(async (_: string, index: number) => {
        const { count } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('poll_id', pollId)
          .eq('option_index', index)
        
        return {
          optionIndex: index,
          votes: count || 0,
          percentage: 0 // Will be calculated below
        }
      })
    )

    // Calculate percentages
    const totalVotes = results.reduce((sum, result) => sum + result.votes, 0)
    results.forEach(result => {
      result.percentage = totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0
    })

    return results
  } catch (error) {
    console.error('Error in getVoteResults:', error)
    throw error
  }
}
