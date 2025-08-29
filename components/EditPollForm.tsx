'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updatePoll, Poll } from "@/lib/actions/polls"

const editPollSchema = z.object({
  question: z.string()
    .min(5, "Question must be at least 5 characters long")
    .max(280, "Question must be less than 280 characters"),
  options: z.array(
    z.string()
      .min(3, "Option must be at least 3 characters long")
      .max(100, "Option must be less than 100 characters")
  )
  .min(2, "At least 2 options are required")
  .max(10, "Maximum 10 options allowed")
})

type EditPollFormData = z.infer<typeof editPollSchema>

interface EditPollFormProps {
  poll: Poll
}

export default function EditPollForm({ poll }: EditPollFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditPollFormData>({
    resolver: zodResolver(editPollSchema),
    defaultValues: {
      question: poll.question,
      options: poll.options
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options"
  })

  const addOption = () => {
    if (fields.length < 10) {
      append("")
    }
  }

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index)
    }
  }

  const onSubmit = async (data: EditPollFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Filter out empty options
      const validOptions = data.options.filter(option => option.trim().length > 0)
      
      if (validOptions.length < 2) {
        setError("At least 2 valid options are required")
        return
      }

      await updatePoll(poll.id, {
        question: data.question,
        options: validOptions
      })

      // Redirect to the poll page with success message
      window.location.href = `/polls/${poll.id}?updated=true`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update poll")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Poll</h1>
        <p className="text-gray-600">Update your poll details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>
            Update the details for your poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                placeholder="What's your question?"
                className="text-lg"
                {...register("question")}
              />
              {errors.question && (
                <p className="text-sm text-red-600">{errors.question.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Poll Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={fields.length >= 10}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...register(`options.${index}` as const)}
                    />
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.options && (
                <p className="text-sm text-red-600">{errors.options.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset Changes
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Poll"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
