import { useMutation } from '@redwoodjs/web'

// entries
//========================

const CREATE_ENTRY_MUTATION = gql`
  mutation CreateEntry {
    createEntry {
      id
    }
  }
`

const useCreateEntry = (options) => {
  const [mutate] = useMutation(CREATE_ENTRY_MUTATION, {
    ...options,
  })

  return mutate
}

//------------------------

const UPDATE_HEADING_MUTATION = gql`
  mutation UpdateHeading($id: Int!, $heading: String!, $createNote: Boolean) {
    updateHeading(id: $id, heading: $heading, createNote: $createNote) {
      id
      heading
      locators {
        id
      }
    }
  }
`

const useUpdateHeading = (options) => {
  const [mutate] = useMutation(UPDATE_HEADING_MUTATION, {
    ...options,
  })

  return mutate
}

// notes
//========================

const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote {
    createNote {
      id
    }
  }
`

const useCreateNote = (options) => {
  const [mutate] = useMutation(CREATE_NOTE_MUTATION, {
    ...options,
  })

  return mutate
}

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

const useUpdateNote = (options) => {
  const [mutate] = useMutation(UPDATE_NOTE_MUTATION, {
    ...options,
  })

  return mutate
}

//========================

export { useCreateEntry, useUpdateHeading, useCreateNote, useUpdateNote }
