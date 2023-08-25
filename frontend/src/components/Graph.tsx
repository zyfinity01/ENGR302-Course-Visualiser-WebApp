import { MouseEvent } from 'react'
import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  /*Panel,*/
} from 'reactflow'
import dagre from 'dagre'

/*
 * Omit position from node as this is calculated dynamically
 */
type ModifiedNode = Omit<Node, 'position'> & { position?: Node['position'] }

interface BasicFlowProps {
  initialNodes: ModifiedNode[]
  initialEdges: Edge[]
  nodeWidth?: number
  nodeHeight?: number
}

const onNodeDrag = (_: MouseEvent, node: Node) => console.log('drag', node)
const onNodeDragStop = (_: MouseEvent, node: Node) =>
  console.log('drag stop', node)
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node)

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const Graph: React.FC<BasicFlowProps> = ({
  initialNodes,
  initialEdges,
  nodeWidth = 172,
  nodeHeight = 36,
}) => {
  /**
   *  Automatically configure grid layout (calculate node x and y)
   */
  const getLayoutedElements = (
    nodes: any[],
    edges: any[],
    nodeWidth: number,
    nodeHeight: number,
    direction = 'TB'
  ) => {
    const isHorizontal = direction === 'LR'
    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      node.targetPosition = isHorizontal ? 'left' : 'top'
      node.sourcePosition = isHorizontal ? 'right' : 'bottom'

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      }

      return node
    })

    return { nodes, edges }
  }

  // Convert nodes to translated ones
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    nodeWidth,
    nodeHeight,
    'LR' // left to right
  )

  return (
    <div id="react-flow-container" style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        defaultNodes={layoutedNodes}
        defaultEdges={layoutedEdges}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onNodeDrag={onNodeDrag}
        minZoom={0.2}
        maxZoom={4}
        fitView
        defaultEdgeOptions={{}}
        selectNodesOnDrag={false}
        elevateNodesOnSelect={false}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />

        {/* <Panel position="top-right">
        <button onClick={() => instance.setViewport({ x: 0, y: 0, zoom: 1 })}>reset transform</button>
      </Panel> */}
      </ReactFlow>
    </div>
  )
}

export default Graph
export type { ModifiedNode as Node, Edge }
