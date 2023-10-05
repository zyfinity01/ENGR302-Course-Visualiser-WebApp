import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  Viewport,
  NodeMouseHandler,
} from 'reactflow'

import { LabelNode } from '../nodes/LabelNode'
import { CourseNode } from '../nodes/CourseNode'
import { Course } from '../models/course'

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
  const getClickedNode: NodeMouseHandler = (
    _event: React.MouseEvent,
    node: Node
  ) => {
    const course = node.data.course as Course
    onNodeClick(course.id)
  }

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      minZoom={0.2}
      maxZoom={4}
      nodeTypes={{ label: LabelNode, course: CourseNode }}
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
