import { Course } from '../models/course'
import { Node, Edge } from '../components/Graph'
import dagre from 'dagre'

interface Graph {
  nodes: { id: string; course: Course }[]
  edges: { sourceId: string; targetId: string }[]
}

export function convertToReactFlowFormat(graph: Graph) {
  const nodes: Node[] = graph.nodes.map((node) => ({
    id: node.id,
    data: { label: node.course.id },
  }))

  const edges: Edge[] = graph.edges.map((edge, index) => ({
    id: `${index}-${edge.sourceId}-${edge.targetId}`,
    source: edge.sourceId,
    target: edge.targetId,
    type: 'smoothstep',
    animated: true,
  }))

  return {
    nodes,
    edges,
  }
}

export function getLayoutedElements(
  nodes: any[],
  edges: any[],
  nodeWidth: number,
  nodeHeight: number,
  direction = 'TB'
) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

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
