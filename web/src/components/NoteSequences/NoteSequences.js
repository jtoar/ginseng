import * as R from 'ramda'
import { Cluster } from '@visx/hierarchy'
import { LinkVertical } from '@visx/shape'
import { Group } from '@visx/group'
import * as d3 from 'd3'
import styled from 'styled-components'

const NoteSequences = ({ notes }) => {
  const data = React.useMemo(() => stratify(notes), [notes])

  return (
    <Wrapper>
      <svg width={400} height={400}>
        <Cluster root={data} size={[350, 350]}>
          {(cluster) => (
            <Group top={50} left={50}>
              {mapLinksToLines(cluster.links())}
              {mapNodes(cluster.descendants())}
            </Group>
          )}
        </Cluster>
      </svg>
    </Wrapper>
  )
}

export default NoteSequences

// ========================

const Wrapper = styled.section`
  grid-area: 'noteSequences';
  background-color: hsl(55deg 50% 50% / 0.25);
  padding: 10px;
`

const stratify = d3
  .stratify()
  .id((d) => d.id)
  .parentId((d) => d.parentId)

const mapLinksToLines = R.map((link, i) => (
  <LinkVertical
    key={`link-${i}`}
    data={link}
    stroke={'#374469'}
    strokeWidth="1"
    fill="none"
  />
))

const mapNodes = R.map((node, i) => <Node key={`node-${i}`} node={node} />)

const Node = ({ node }) => (
  <Group top={node.y} left={node.x}>
    {node.depth !== 0 && (
      <circle
        r={12}
        fill={'#306c90'}
        stroke={'white'}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.id)}`)
        }}
      />
    )}
    <text
      dy=".33em"
      fontSize={9}
      fontFamily="Arial"
      textAnchor="middle"
      style={{ pointerEvents: 'none' }}
      fill={'white'}
    >
      {node.data.id}
    </text>
  </Group>
)

// const Node = ({ node }) => {
//   const width = 40
//   const height = 20
//   const centerX = -width / 2
//   const centerY = -height / 2

//   return (
//     <Group top={node.x} left={node.y}>
//       <rect
//         height={height}
//         width={width}
//         y={centerY}
//         x={centerX}
//         fill={'#272b4d'}
//         stroke={'#26deb0'}
//         strokeWidth={1}
//         strokeDasharray="2,2"
//         strokeOpacity={0.6}
//         rx={10}
//         onClick={() => {
//           alert(`clicked: ${JSON.stringify(node.data.id)}`)
//         }}
//       />
//       <text
//         dy=".33em"
//         fontSize={9}
//         fontFamily="Arial"
//         textAnchor="middle"
//         fill={'#26deb0'}
//         style={{ pointerEvents: 'none' }}
//       >
//         {node.data.id}
//       </text>
//     </Group>
//   )
// }
