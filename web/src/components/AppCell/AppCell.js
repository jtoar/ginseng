import styled from 'styled-components'
import { Form, TextAreaField, Submit, TextField, Label } from '@redwoodjs/forms'
import * as R from 'ramda'
import {
  useCreateEntry,
  useUpdateHeading,
  useCreateNote,
  useUpdateNote,
} from './AppCell.hooks'
import { useForm } from 'react-hook-form'

export const QUERY = gql`
  query AppQuery {
    entries {
      id
      createdAt
      updatedAt
      heading
      locators {
        id
      }
    }
    notes {
      id
      createdAt
      updatedAt
      text
      entries {
        id
        heading
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ entries, notes }) => {
  const createEntry = useCreateEntry({
    refetchQueries: ['AppQuery'],
  })

  const createNote = useCreateNote({
    refetchQueries: ['AppQuery'],
  })

  return (
    <GridWrapper>
      <IndexWrapper>
        <h2>index</h2>
        <Form onSubmit={(data) => createEntry({ variables: { input: data } })}>
          <Label name="heading">heading</Label>
          <TextField
            name="heading"
            placeholder="sleep, complexity, mike wazowski"
          />
          <Submit>save</Submit>
        </Form>
        <dl>{mapEntriesToJSX(entries)}</dl>
      </IndexWrapper>
      <NotesWrapper>
        <h2>notes</h2>
        <button onClick={createNote}>create</button>
        {mapNotesToJSX(notes)}
      </NotesWrapper>
    </GridWrapper>
  )
}

// styles
//========================

const GridWrapper = styled.main`
  display: grid;
  grid-template:
    1fr
    / 1fr 1fr;
  grid-template-areas: 'index notes';
  height: 100%;
`

const IndexWrapper = styled.section`
  grid-area: 'index';
  background-color: hsl(220deg 50% 50% / 0.25);
  padding: 10px;
`

const NotesWrapper = styled.section`
  grid-area: 'notes';
  background-color: hsl(110deg 50% 50% / 0.25);
  padding: 10px;
`

// entries
// ========================

const mapEntriesToJSX = R.map((entry) => <Entry key={entry.id} entry={entry} />)

const Entry = ({ entry }) => {
  const [editing, setEditing] = React.useState(false)

  const updateHeading = useUpdateHeading({
    variables: {
      id: entry.id,
    },
    refetchQueries: ['AppQuery'],
    onCompleted: () => setEditing(false),
  })

  const formMethods = useForm()

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        setEditing(false)
        break
      case 'Enter':
        if (e.metaKey) {
          formMethods.handleSubmit((data) =>
            updateHeading({
              variables: {
                ...data,
                createNote: true,
              },
            })
          )()
          setEditing(false)
        }
        break
    }
  }

  return (
    <DescriptionTermWrapper data-entry-id={entry.id} tabIndex="-1">
      {editing ? (
        <Form
          formMethods={formMethods}
          onSubmit={(data) => updateHeading({ variables: data })}
        >
          <TextField
            name="heading"
            defaultValue={entry.heading}
            autoFocus={true}
            onBlur={() => setEditing(false)}
            onKeyDown={handleKeyDown}
          ></TextField>
          <Submit>save</Submit>
        </Form>
      ) : (
        <BWrapper onDoubleClick={() => setEditing(true)}>
          {entry.heading}
        </BWrapper>
      )}
      <LocatorsWrapper>{mapLocatorsToJSX(entry.locators)}</LocatorsWrapper>
    </DescriptionTermWrapper>
  )
}

const mapLocatorsToJSX = R.map((locator) => {
  const goToNote = (e) => {
    e.preventDefault()
    findNoteById(locator.id)?.focus()
  }

  return (
    <LocatorWrapper key={locator.id} tabIndex="-1" onKeyDown={goToNote}>
      {locator.id}
    </LocatorWrapper>
  )
})

// style
//------------------------

const DescriptionTermWrapper = styled.dt`
  &:focus {
    outline: 2px dotted hsl(220deg 50% 50%);
  }
`

const BWrapper = styled.b`
  &:after {
    content: '...';
  }
`

const LocatorsWrapper = styled.ol`
  display: inline;
  list-style: none;
`

const LocatorWrapper = styled.li`
  display: inherit;

  &:after {
    content: ', ';
  }

  &:focus {
    outline: 2px dotted hsl(220deg 50% 50%);
  }
`

// notes
// ========================

const mapNotesToJSX = R.map((note) => <Note key={note.id} note={note} />)

const Note = ({ note }) => {
  const updateNote = useUpdateNote({
    variables: {
      id: note.id,
    },
    refetchQueries: ['AppQuery'],
  })

  return (
    <StyledForm
      data-note-id={note.id}
      onSubmit={(data) => updateNote({ variables: { input: data } })}
    >
      <H3>{note.id}</H3>
      <TextAreaField name="text" defaultValue={note.text} />
      <TextField name="heading" />
      <Submit>save</Submit>
      <NoteEntriesWrapper>
        {mapNoteEntriesToJSX(note.entries)}
      </NoteEntriesWrapper>
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

const findNoteById = findByDataIdAndSelectors('note')('textarea')
const findEntryById = findByDataIdAndSelectors('entry')('')
