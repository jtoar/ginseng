import { db } from 'src/lib/db'

export const entries = async () => {
  const entries = await db.entry.findMany({
    include: {
      parentEntry: true,
    },
  })

  return entries.filter((entry) => entry.parentEntry === null)
}

export const entry = ({ id }) => {
  return db.entry.findUnique({
    where: { id },
  })
}

export const createEntry = ({ input = {} }) => {
  const { createNote, createSubEntry, ...rest } = input

  return db.entry.create({
    data: {
      ...rest,
      ...(createNote && {
        locators: {
          create: {},
        },
      }),
      ...(createSubEntry && {
        subEntries: {
          create: {},
        },
      }),
    },
  })
}

export const updateEntry = ({ id, input }) => {
  const { createNote, ...rest } = input

  return db.entry.update({
    where: { id },
    data: {
      ...rest,
      ...(createNote && {
        locators: {
          create: {},
        },
      }),
    },
  })
}

export const deleteEntry = ({ id }) => {
  return db.entry.delete({
    where: { id },
  })
}

export const Entry = {
  locators: (_obj, { root }) =>
    db.entry.findUnique({ where: { id: root.id } }).locators(),
  subEntries: (_obj, { root }) =>
    db.entry.findUnique({ where: { id: root.id } }).subEntries(),
  parentEntry: (_obj, { root }) =>
    db.entry.findUnique({ where: { id: root.id } }).parentEntry(),
}
