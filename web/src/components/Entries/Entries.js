import styled from 'styled-components'
import { Form, Submit, TextField, Label } from '@redwoodjs/forms'
import * as R from 'ramda'
import { useCreateEntry, useUpdateEntry } from './Entries.hooks'
import { useForm } from 'react-hook-form'

const Entries = ({ entries }) => {
  const [createEntry] = useCreateEntry({
    refetchQueries: ['AppQuery'],
  })

  //------------------------

  const formMethods = useForm()

  const handleKeyDown = (e) => {
    if (e.metaKey && e.key === 'Enter') {
      formMethods.handleSubmit((data) => {
        createEntry({
          variables: {
            input: {
              ...data,
              createNote: true,
            },
          },
        })
      })()
      formMethods.reset()
    }
    if (e.key === 'Tab') {
      formMethods.handleSubmit((data) => {
        createEntry({
          variables: {
            input: {
              ...data,
              createSubEntry: true,
            },
          },
        })
      })()
    }
  }

  return (
    <EntriesWrapper>
      <h2>index</h2>
      <Form
        formMethods={formMethods}
        onSubmit={(data) => {
          createEntry({ variables: { input: data } })
          formMethods.reset()
        }}
      >
        <Label name="heading">heading</Label>
        <TextField
          name="heading"
          placeholder="sleep, complexity, mike wazowski"
          onKeyDown={handleKeyDown}
        />
        <Submit>save</Submit>
      </Form>
      <dl>{mapEntriesToJSX(entries)}</dl>
    </EntriesWrapper>
  )
}

export default Entries

//========================

const EntriesWrapper = styled.section`
  grid-area: 'index';
  background-color: hsl(220deg 50% 50% / 0.25);
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`

//------------------------

// const mapEntriesToJSX = R.map((entry) => (
//   <>
//     <Entry key={entry.id} entry={entry} />
//     {entry.subEntries && mapEntriesToJSX(entry.subEntries)}
//   </>
// ))

const mapSubEntriesToJSX = R.map((entry) => (
  <DescriptionDefinitionWrapper
    key={entry.id}
    data-entry-id={entry.id}
    tabIndex="-1"
  >
    <Entry entry={entry} />
  </DescriptionDefinitionWrapper>
))

const mapEntriesToJSX = R.map((entry) => (
  <>
    <DescriptionTermWrapper
      key={entry.id}
      data-entry-id={entry.id}
      tabIndex="-1"
    >
      <Entry entry={entry} />
    </DescriptionTermWrapper>
    {entry.subEntries && mapSubEntriesToJSX(entry.subEntries)}
  </>
))

const DescriptionTermWrapper = styled.dt`
  &:focus {
    outline: 2px dotted hsl(220deg 50% 50%);
  }
`

const DescriptionDefinitionWrapper = styled.dd`
  &:focus {
    outline: 2px dotted hsl(220deg 50% 50%);
  }
`

//------------------------

const Entry = ({ entry }) => {
  const [editing, setEditing] = React.useState(false)

  const [updateEntry] = useUpdateEntry({
    variables: {
      id: entry.id,
    },
    refetchQueries: ['AppQuery'],
    onCompleted: () => setEditing(false),
  })

  //------------------------

  const formMethods = useForm()

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        setEditing(false)
        break
      case 'Enter':
        if (e.metaKey) {
          formMethods.handleSubmit((data) =>
            updateEntry({
              variables: {
                input: {
                  ...data,
                  createNote: true,
                },
              },
            })
          )()
          setEditing(false)
        }
        break
    }
  }

  return (
    <>
      {editing ? (
        <Form
          formMethods={formMethods}
          onSubmit={(data) => updateEntry({ variables: { input: data } })}
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
    </>
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

//------------------------

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

// utils
//========================

const findByDataIdAndSelectors = (entity) => (selectors) => (id) =>
  document.querySelector(`[data-${entity}-id="${id}"] ${selectors}`)

const findNoteById = findByDataIdAndSelectors('note')('textarea')
