import { createMachine, spawn, assign } from 'xstate'
import { useMachine } from '@xstate/react'
import * as R from 'ramda'

// entry
//========================

const updateEntryHeading = assign((_ctx, e) => ({
  heading: e.heading,
}))

const entryMachineActions = {
  updateEntryHeading,
}

//------------------------

const entryMachine = ({ id = guidGenerator(), locators = [] }) =>
  createMachine(
    {
      id: 'entry',
      initial: 'edit',
      context: {
        id,
        heading: '',
        locators,
      },
      states: {
        edit: {
          on: {
            updateEntryHeading: {
              target: 'idle',
              actions: 'updateEntryHeading',
            },
          },
        },
        idle: {
          on: {
            dblclick: {
              target: 'edit',
            },
          },
        },
      },
    },
    {
      actions: entryMachineActions,
    }
  )

// note
//========================

const updateNoteText = assign((_ctx, e) => ({ text: e.text }))

const noteMachineActions = {
  updateNoteText,
}

//------------------------

const noteMachine = ({ id = guidGenerator(), entries = [] }) =>
  createMachine(
    {
      id: 'note',
      initial: 'idle',
      context: {
        id,
        text: '',
        entries,
      },
      states: {
        idle: {
          on: {
            updateNoteText: {
              actions: 'updateNoteText',
            },
          },
        },
      },
    },
    {
      actions: noteMachineActions,
    }
  )

// home
//========================

const createEntry = assign((ctx, _e) => {
  const id = guidGenerator()

  return {
    entries: [
      {
        id,
        ref: spawn(entryMachine({ id }), `entry-${id}`),
      },
      ...ctx.entries,
    ],
  }
})

const createNote = assign((ctx, _e) => {
  const id = guidGenerator()

  return {
    notes: [
      {
        id,
        ref: spawn(noteMachine({ id }), `note-${id}`),
      },
      ...ctx.notes,
    ],
  }
})

const createEntryWithNote = assign((ctx, _e) => {
  const entryId = guidGenerator()
  const noteId = guidGenerator()

  return {
    entries: [
      {
        id: entryId,
        ref: spawn(
          entryMachine({ id: entryId, locators: [noteId] }),
          `entry-${entryId}`
        ),
      },
      ...ctx.entries,
    ],
    notes: [
      {
        id: noteId,
        ref: spawn(
          noteMachine({ id: noteId, entries: [entryId] }),
          `note-${noteId}`
        ),
      },
      ...ctx.notes,
    ],
  }
})

const homePageMachineActions = {
  createEntry,
  createNote,
  createEntryWithNote,
}

const homePageMachine = createMachine(
  {
    id: 'homePage',
    initial: 'idle',
    context: {
      entries: [],
      notes: [],
    },
    states: {
      idle: {
        on: {
          createEntry: {
            actions: 'createEntry',
          },
          createNote: {
            actions: 'createNote',
          },
          createEntryWithNote: {
            actions: 'createEntryWithNote',
          },
        },
      },
    },
  },
  {
    actions: homePageMachineActions,
  }
)

const useHomePageMachine = () => useMachine(homePageMachine)

export { homePageMachine, useHomePageMachine }

//========================

const guidGenerator = () => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}
