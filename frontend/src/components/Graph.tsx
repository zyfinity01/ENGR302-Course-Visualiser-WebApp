import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  useReactFlow,
} from 'reactflow'
import dagre from 'dagre'
import { useEffect } from 'react'
import { getLayoutedElements } from '../services/CourseToGraph'

export type NonPositionalNode = Omit<Node, 'position'> & {
  position?: Node['position'] // Omit position from node as this is calculated dynamically
}

interface BasicFlowProps {
  initialNodes: NonPositionalNode[]
  initialEdges: Edge[]
  nodeWidth?: number
  nodeHeight?: number
  focusNodeRef: (fn: (id: string) => boolean) => void
}

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const Graph: React.FC<BasicFlowProps> = ({
  initialNodes,
  initialEdges,
  nodeWidth = 172,
  nodeHeight = 36,
  focusNodeRef,
}) => {
  const reactFlowInstance = useReactFlow()

  // Pass the focusNode function up to the parent component
  useEffect(() => {
    focusNodeRef(focusNode)
  }, [focusNodeRef])

  // Convert nodes to translated ones
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    nodeWidth,
    nodeHeight,
    'LR' // left to right
  )

  // Focus viewport on a specific node by id
  const focusNode = (id: string) => {
    const node = layoutedNodes.find((n) => n.id === id)

    if (node && node.position) {
      reactFlowInstance?.fitView({ nodes: [node] })
      return true
    }

    return false
  }

  return (
    <ReactFlow
      defaultNodes={layoutedNodes}
      defaultEdges={layoutedEdges}
      minZoom={0.2}
      maxZoom={4}
      fitView
      defaultEdgeOptions={{}}
      selectNodesOnDrag={false}
      elevateNodesOnSelect={false}
      onNodeClick={(e) => console.log(e)}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  )
}

export default Graph
export type { NonPositionalNode as Node, Edge }
