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
  const { heading, ...rest } = input

  return db.note.update({
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
    },
    where: { id },
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
}
