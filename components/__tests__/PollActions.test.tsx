import { render, screen, fireEvent, within } from '@testing-library/react'
import React from 'react'
import PollActions from '../PollActions'

// Mock server action
vi.mock('@/lib/actions/polls', () => ({
  deletePoll: vi.fn(async () => Promise.resolve()),
}))

import { deletePoll } from '@/lib/actions/polls'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('PollActions', () => {
  const poll = { id: 'poll-123', question: 'Best JS framework?' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders edit and delete buttons', () => {
    render(<PollActions poll={poll} />)

    // edit button is a link with a button inside
    const editButton = screen.getAllByRole('button')[0]
    expect(editButton).toBeInTheDocument()

    // delete icon button also present
    const deleteButtons = screen.getAllByRole('button')
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2)
  })

  it('opens delete confirmation modal when delete is clicked', () => {
    render(<PollActions poll={poll} />)

    const deleteIconBtn = screen.getAllByRole('button')[1]
    fireEvent.click(deleteIconBtn)

    expect(
      screen.getByText('Delete Poll')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()
  })

  it('closes modal when cancel is clicked', () => {
    render(<PollActions poll={poll} />)
    fireEvent.click(screen.getAllByRole('button')[1])

    const modal = screen.getByText('Delete Poll').closest('div')!.parentElement!
    const utils = within(modal)
    fireEvent.click(utils.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByText('Delete Poll')).not.toBeInTheDocument()
  })

  it('calls deletePoll and disables button while deleting', async () => {
    const deletePollMock = deletePoll as unknown as ReturnType<typeof vi.fn>
    render(<PollActions poll={poll} />)

    // open modal
    fireEvent.click(screen.getAllByRole('button')[1])

    const confirmBtn = screen.getByRole('button', { name: 'Delete' })
    expect(confirmBtn).toBeEnabled()

    // simulate slow action
    deletePollMock.mockImplementationOnce(() => new Promise((res) => setTimeout(res, 10)))

    fireEvent.click(confirmBtn)

    // should be disabled while pending
    expect(confirmBtn).toBeDisabled()

    // wait for microtask queue
    await vi.waitUntil(() => deletePollMock.mock.calls.length === 1)
  })
})
