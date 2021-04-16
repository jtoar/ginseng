import { db } from 'src/lib/db'

export const entries = () => {
  return db.entry.findMany()
}

export const entry = ({ id }) => {
  return db.entry.findUnique({
    where: { id },
  })
}

export const createEntry = ({ input = {} }) => {
  return db.entry.create({
    data: input,
  })
}

export const updateEntry = ({ id, input }) => {
  return db.entry.update({
    data: input,
    where: { id },
  })
}

export const updateHeading = ({ id, heading, createNote = false }) => {
  return db.entry.update({
    where: { id },
    data: {
      heading,
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
}
