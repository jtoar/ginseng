import styled from 'styled-components'
import { useHomePageMachine } from './HomePage.machine'
import * as R from 'ramda'
import { Form, Label, TextField, TextAreaField, Submit } from '@redwoodjs/forms'
import { useActor } from '@xstate/react'
import { useForm } from 'react-hook-form'

const HomePage = () => {
  const [state, send] = useHomePageMachine()

  return (
    <GridWrapper>
      <IndexWrapper>
        <h2>index</h2>
        <button onClick={() => send('createEntry')}>create</button>
        <dl>{mapEntriesToJSX(state.context.entries)}</dl>
      </IndexWrapper>
      <NotesWrapper>
        <h2>notes</h2>
        <button onClick={() => send('createNote')}>create</button>
        {mapNotesToJSX(state.context.notes)}
      </NotesWrapper>
    </GridWrapper>
  )
}

export default HomePage

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
`

const NotesWrapper = styled.section`
  grid-area: 'notes';
  background-color: hsl(110deg 50% 50% / 0.25);
`

// entries
// ========================

const mapEntriesToJSX = R.map((entry) => <Entry key={entry.id} entry={entry} />)

const Entry = ({ entry }) => {
  const [state, send] = useActor(entry.ref)

  return R.cond([
    [
      R.either(R.equals('idle'), R.equals('createNoteWithEntry')),
      () => <EntryIdle {...state.context} send={send} />,
    ],
    [
      R.equals('edit'),
      () => (
        <EntryEdit
          {...state.context}
          updateHeading={(data) =>
            send({ type: 'updateHeading', heading: data.heading })
          }
          send={send}
        />
      ),
    ],
  ])(state.value)
}

const mapLocatorsToJSX = R.map((locator) => (
  <LocatorWrapper key={locator}>{locator}</LocatorWrapper>
))

const EntryIdle = ({ id, heading, locators, send }) => (
  <DescriptionTermWrapper onDoubleClick={send} data-id={id} tabIndex="-1">
    {heading}{' '}
    {locators && (
      <LocatorsWrapper>{mapLocatorsToJSX(locators)}</LocatorsWrapper>
    )}
  </DescriptionTermWrapper>
)

const DescriptionTermWrapper = styled.dt`
  &:focus {
    outline-offset: 4px;
    outline: 4px solid blue;
  }
`

const EntryEdit = ({ id, heading, locators, updateHeading, send }) => {
  const formMethods = useForm()

  const updateHeadingAndCreateNote = (e) => {
    if (e.metaKey && e.code === 'Enter') {
      formMethods.handleSubmit((data) =>
        send({
          type: 'updateHeading',
          heading: data.heading,
          andCreateNote: true,
        })
      )()
    }
  }

  return (
    <Form formMethods={formMethods} onSubmit={updateHeading} data-id={id}>
      <Label name="heading" />
      <TextField
        name="heading"
        defaultValue={heading}
        onKeyDown={updateHeadingAndCreateNote}
        autoFocus={true}
      />
      {locators && (
        <LocatorsWrapper>{mapLocatorsToJSX(locators)}</LocatorsWrapper>
      )}
      <Submit>save</Submit>
    </Form>
  )
}

// style
//------------------------

const LocatorsWrapper = styled.ol`
  display: inline;
  list-style: none;
`

const LocatorWrapper = styled.li`
  display: inherit;
`

// notes
// ========================

const mapNotesToJSX = R.map((note) => {
  return <Note key={note.id} note={note} />
})

const Note = ({ note }) => {
  const [state, send] = useActor(note.ref)

  const updateNoteText = (data) =>
    send({ type: 'updateNoteText', text: data.text })

  return (
    <Form onSubmit={updateNoteText} data-id={note.id}>
      <h3>{state.context.id}</h3>
      <Label name="text" />
      <TextAreaField
        name="text"
        defaultValue={state.context.text}
        autoFocus={true}
      />
      <Submit>save</Submit>
    </Form>
  )
}
