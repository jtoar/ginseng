import { render } from '@redwoodjs/testing'

import Entries from './Entries'

describe('Entries', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Entries />)
    }).not.toThrow()
  })
})
