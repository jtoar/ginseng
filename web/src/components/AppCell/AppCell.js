import styled from 'styled-components'
import Entries from 'src/components/Entries'
import Notes from 'src/components/Notes'

export const QUERY = gql`
  query AppQuery {
    entries {
      id
      createdAt
      updatedAt
      heading
      locators {
        id
      }
      subEntries {
        id
        heading
        locators {
          id
        }
      }
    }
    notes {
      id
      createdAt
      updatedAt
      text
      entries {
        id
        heading
      }
      children {
        id
      }
      parents {
        id
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ entries, notes }) => (
  <Wrapper>
    <Entries entries={entries} />
    <Notes notes={notes} />
  </Wrapper>
)

const Wrapper = styled.main`
  display: grid;
  grid-template:
    1fr
    / 1fr 1fr;
  grid-template-areas: 'index notes';
  height: 100%;
`
