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
  }

  type Mutation {
    createEntry(input: CreateEntryInput): Entry!
    updateEntry(id: Int!, input: UpdateEntryInput!): Entry!
    updateHeading(id: Int!, heading: String!, createNote: Boolean): Entry!
    deleteEntry(id: Int!): Entry!
  }
`
