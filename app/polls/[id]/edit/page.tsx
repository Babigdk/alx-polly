import { getPoll } from "@/lib/actions/polls"
import { notFound } from "next/navigation"
import EditPollForm from "@/components/EditPollForm"

interface PageProps {
  params: { id: string }
}

export default async function EditPollPage({ params }: PageProps) {
  const poll = await getPoll(params.id)
  
  if (!poll) {
    notFound()
  }

  return <EditPollForm poll={poll} />
}
