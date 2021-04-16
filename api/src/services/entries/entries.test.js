import {
  entries,
  entry,
  createEntry,
  updateEntry,
  deleteEntry,
} from './entries'

describe('entries', () => {
  scenario('returns all entries', async (scenario) => {
    const result = await entries()

    expect(result.length).toEqual(Object.keys(scenario.entry).length)
  })

  scenario('returns a single entry', async (scenario) => {
    const result = await entry({ id: scenario.entry.one.id })

    expect(result).toEqual(scenario.entry.one)
  })

  scenario('creates a entry', async (scenario) => {
    const result = await createEntry({
      input: { updatedAt: '2021-04-16T22:04:13Z', heading: 'String8168200' },
    })

    expect(result.updatedAt).toEqual('2021-04-16T22:04:13Z')
    expect(result.heading).toEqual('String8168200')
  })

  scenario('updates a entry', async (scenario) => {
    const original = await entry({ id: scenario.entry.one.id })
    const result = await updateEntry({
      id: original.id,
      input: { updatedAt: '2021-04-17T22:04:13Z' },
    })

    expect(result.updatedAt).toEqual('2021-04-17T22:04:13Z')
  })

  scenario('deletes a entry', async (scenario) => {
    const original = await deleteEntry({ id: scenario.entry.one.id })
    const result = await entry({ id: original.id })

    expect(result).toEqual(null)
  })
})
