export const schema = gql`
  type Entry {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    heading: String
    locators: [Note]!
  }

  type Query {
    entries: [Entry!]!
    entry(id: Int!): Entry
  }

  input CreateEntryInput {
    heading: String
  }

  input UpdateEntryInput {
    heading: String
    createNote: Boolean
  }

  type Mutation {
    createEntry(input: CreateEntryInput): Entry!
    updateEntry(id: Int!, input: UpdateEntryInput!): Entry!
    deleteEntry(id: Int!): Entry!
  }
`
