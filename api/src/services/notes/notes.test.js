import { notes, note, createNote, updateNote, deleteNote } from './notes'

describe('notes', () => {
  scenario('returns all notes', async (scenario) => {
    const result = await notes()

    expect(result.length).toEqual(Object.keys(scenario.note).length)
  })

  scenario('returns a single note', async (scenario) => {
    const result = await note({ id: scenario.note.one.id })

    expect(result).toEqual(scenario.note.one)
  })

  scenario('creates a note', async (scenario) => {
    const result = await createNote({
      input: { updatedAt: '2021-04-16T22:04:08Z' },
    })

    expect(result.updatedAt).toEqual('2021-04-16T22:04:08Z')
  })

  scenario('updates a note', async (scenario) => {
    const original = await note({ id: scenario.note.one.id })
    const result = await updateNote({
      id: original.id,
      input: { updatedAt: '2021-04-17T22:04:08Z' },
    })

    expect(result.updatedAt).toEqual('2021-04-17T22:04:08Z')
  })

  scenario('deletes a note', async (scenario) => {
    const original = await deleteNote({ id: scenario.note.one.id })
    const result = await note({ id: original.id })

    expect(result).toEqual(null)
  })
})
