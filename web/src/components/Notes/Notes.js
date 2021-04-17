import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import * as R from 'ramda'
import { Form, TextAreaField, Submit, TextField } from '@redwoodjs/forms'

import { useCreateNote, useUpdateNote } from './Notes.hooks'

const Notes = ({ notes }) => {
  const [createNote] = useCreateNote({
    refetchQueries: ['AppQuery'],
  })

  return (
    <Wrapper>
      <h2>notes</h2>
      <button onClick={createNote}>create</button>
      {mapNotesToJSX(notes)}
    </Wrapper>
  )
}

export default Notes

//========================

const Wrapper = styled.section`
  grid-area: 'notes';
  background-color: hsl(110deg 50% 50% / 0.25);
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`

// ========================

const mapNotesToJSX = R.map((note) => <Note key={note.id} note={note} />)

const Note = ({ note }) => {
  const [updateNote] = useUpdateNote({
    variables: {
      id: note.id,
    },
    refetchQueries: ['AppQuery'],
  })

  const formMethods = useForm()

  const updateNoteAndCreateNote = (e) => {
    if (e.metaKey && e.key === 'Enter') {
      formMethods.handleSubmit((data) => {
        updateNote({
          variables: {
            input: {
              ...data,
              createNote: true,
            },
          },
        })
      })()
    }
  }

  return (
    <StyledForm
      data-note-id={note.id}
      formMethods={formMethods}
      onSubmit={(data) => updateNote({ variables: { input: data } })}
    >
      <H3>{note.id}</H3>
      <TextAreaField
        name="text"
        defaultValue={note.text}
        onKeyDown={updateNoteAndCreateNote}
      />
      <TextField name="heading" />
      <Submit>save</Submit>
      <NoteEntriesWrapper>
        {mapNoteEntriesToJSX(note.entries)}
      </NoteEntriesWrapper>
      {/* note children */}
      <p>children: {JSON.stringify(note.children)}</p>
      <p>parents: {JSON.stringify(note.parents)}</p>
    </StyledForm>
  )
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const H3 = styled.h3`
  display: inline;
  font-size: inherit;
  font-weight: normal;
  padding: 0px;
  margin: 0px;
`

const mapNoteEntriesToJSX = R.map((entry) => {
  const goToEntry = (e) => {
    e.preventDefault()
    findEntryById(entry.id)?.focus()
  }

  return (
    <NoteEntryWrapper key={entry.heading} tabIndex="-1" onKeyDown={goToEntry}>
      {entry.heading}
    </NoteEntryWrapper>
  )
})

const NoteEntriesWrapper = styled.ul`
  display: inline;
  list-style: none;
  padding: 0px;
  margin: 0px;
`

const NoteEntryWrapper = styled.li`
  display: inherit;

  &:focus {
    outline: 2px dotted hsl(220deg 50% 50%);
  }
`

// utils
//========================

const findByDataIdAndSelectors = (entity) => (selectors) => (id) =>
  document.querySelector(`[data-${entity}-id="${id}"] ${selectors}`)

const findEntryById = findByDataIdAndSelectors('entry')('')
