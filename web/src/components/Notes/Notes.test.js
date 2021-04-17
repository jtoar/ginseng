import { render } from '@redwoodjs/testing'

import Notes from './Notes'

describe('Notes', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Notes />)
    }).not.toThrow()
  })
})
