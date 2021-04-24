import { render } from '@redwoodjs/testing'

import NoteSequences from './NoteSequences'

describe('NoteSequences', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NoteSequences />)
    }).not.toThrow()
  })
})
