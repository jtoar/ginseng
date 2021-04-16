import { createMachine, spawn, assign, sendParent } from 'xstate'
import { useMachine } from '@xstate/react'
import * as R from 'ramda'

// entry
//========================

const updateHeading = assign((_ctx, e) => ({
  heading: e.heading,
}))

const createLocator = assign((ctx, _e) => ({
  locators: [...ctx.locators, guidGenerator()],
}))

const createNoteWithEntry = sendParent((ctx, _e) => ({
  type: 'createNote',
  entryId: ctx.id,
  noteId: R.last(ctx.locators),
}))

const entryMachineActions = {
  updateHeading,
  createLocator,
  createNoteWithEntry,
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
        idle: {
          on: {
            dblclick: {
              target: 'edit',
            },
          },
        },
        edit: {
          on: {
            updateHeading: [
              {
                cond: (_ctx, e) => e.andCreateNote,
                target: 'createNoteWithEntry',
                actions: ['updateHeading', 'createLocator'],
              },
              {
                target: 'idle',
                actions: 'updateHeading',
              },
            ],
          },
        },
        createNoteWithEntry: {
          always: {
            target: 'idle',
            actions: 'createNoteWithEntry',
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

const createNote = assign((ctx, e) => {
  const id = e.noteId ? e.noteId : guidGenerator()

  return {
    notes: [
      {
        id,
        ref: spawn(noteMachine({ id }), `note-${id}`),
        ...(e.entryId && { entries: [e.entryId] }),
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
