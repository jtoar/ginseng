import { useMutation } from '@redwoodjs/web'

// create
//------------------------

const CREATE_ENTRY_MUTATION = gql`
  mutation CreateEntry($input: CreateEntryInput) {
    createEntry(input: $input) {
      id
      heading
    }
  }
`

const useCreateEntry = (options) =>
  useMutation(CREATE_ENTRY_MUTATION, {
    ...options,
  })

// update
//------------------------

const UPDATE_ENTRY_MUTATION = gql`
  mutation UpdateHeading($id: Int!, $input: UpdateEntryInput!) {
    updateEntry(id: $id, input: $input) {
      id
      heading
      locators {
        id
      }
    }
  }
`

const useUpdateEntry = (options) =>
  useMutation(UPDATE_ENTRY_MUTATION, {
    ...options,
  })

//========================

export { useCreateEntry, useUpdateEntry }
