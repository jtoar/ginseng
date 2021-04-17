import { useMutation } from '@redwoodjs/web'

// create
//------------------------

const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote {
    createNote {
      id
    }
  }
`

const useCreateNote = (options) =>
  useMutation(CREATE_NOTE_MUTATION, {
    ...options,
  })

// update
//------------------------

const UPDATE_NOTE_MUTATION = gql`
  mutation UpdateNote($id: Int!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
      id
      text
      entries {
        heading
      }
    }
  }
`

const useUpdateNote = (options) =>
  useMutation(UPDATE_NOTE_MUTATION, {
    ...options,
  })

//========================

export { useCreateNote, useUpdateNote }
