import { db } from 'src/lib/db'

export const notes = () => {
  return db.note.findMany()
}

export const note = ({ id }) => {
  return db.note.findUnique({
    where: { id },
  })
}

export const createNote = ({ input = {} }) => {
  return db.note.create({
    data: input,
  })
}

export const updateNote = ({ id, input }) => {
  const { heading, createNote, ...rest } = input

  return db.note.update({
    where: { id },
    data: {
      ...rest,
      ...(heading && {
        entries: {
          connectOrCreate: {
            create: {
              heading,
            },
            where: {
              heading,
            },
          },
        },
      }),
      ...(createNote && {
        children: {
          create: {},
        },
      }),
    },
  })
}

export const deleteNote = ({ id }) => {
  return db.note.delete({
    where: { id },
  })
}

export const Note = {
  entries: (_obj, { root }) =>
    db.note.findUnique({ where: { id: root.id } }).entries(),
  children: (_obj, { root }) =>
    db.note.findUnique({ where: { id: root.id } }).children(),
  parents: (_obj, { root }) =>
    db.note.findUnique({ where: { id: root.id } }).parents(),
}
