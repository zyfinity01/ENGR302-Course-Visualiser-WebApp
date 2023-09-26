import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  Viewport,
} from 'reactflow'

import { LabelNode } from '../nodes/LabelNode'

export type NonPositionalNode = Omit<Node, 'position'> & {
  position?: Node['position'] // Omit position from node as this is calculated dynamically
}
interface BasicFlowProps {
  nodes: Node[]
  edges: Edge[]
  defaultViewport?: Viewport
  fitView?: boolean
  onNodeClick: (course: string) => void
}

const Graph: React.FC<BasicFlowProps> = ({
  nodes,
  edges,
  defaultViewport,
  fitView,
  onNodeClick,
}) => {
  const getClickedNode = ({ target }: any) => {
    const node = target as HTMLDivElement
    const courseId = node.getAttribute('data-id')
    if (courseId) {
      onNodeClick(courseId)
    }
  }

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      minZoom={0.2}
      maxZoom={4}
      nodeTypes={{ label: LabelNode }}
      defaultEdgeOptions={{}}
      selectNodesOnDrag={false}
      elevateNodesOnSelect={false}
      onNodeClick={getClickedNode}
      defaultViewport={defaultViewport}
      fitView={fitView}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  )
}

export default Graph
export type { Node, Edge }
