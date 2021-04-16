export const schema = gql`
  type Note {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    text: String!
    entries: [Entry]!
  }

  type Query {
    notes: [Note!]!
    note(id: Int!): Note
  }

  input CreateNoteInput {
    text: String
  }

  input UpdateNoteInput {
    text: String
    heading: String
  }

  type Mutation {
    createNote(input: CreateNoteInput): Note!
    updateNote(id: Int!, input: UpdateNoteInput!): Note!
    deleteNote(id: Int!): Note!
  }
`
