import { Course } from '../models/course'
import { Node, Edge } from '../components/Graph'
import dagre from 'dagre'

interface Graph {
  nodes: { id: string; course: Course }[]
  edges: { sourceId: string; targetId: string }[]
}

export type NonPositionalNode = Omit<Node, 'position'> & {
  position?: Node['position'] // Omit position from node as this is calculated dynamically
}

export function convertToReactFlowFormat(graph: Graph): {
  nodes: NonPositionalNode[]
  edges: Edge[]
} {
  const nodes: NonPositionalNode[] = graph.nodes.map((node) => ({
    id: node.id,
    type: 'course',
    data: { label: node.course.id, course: node.course },
  }))

  // Adding Custom Label Nodes
  const levels = new Set(nodes.map((node) => node.data.course.level))
  const trimesters = new Set(nodes.map((node) => node.data.course.trimester))
  levels.forEach((level) => {
    trimesters.forEach((trimester) => {
      nodes.push({
        type: 'label',
        id: `label-${level}-T${trimester}`,
        data: { label: `${level} T${trimester}`, level, trimester },
        style: { background: 'transparent', color: '#000' },
      })
    })
  })

  const edges: Edge[] = graph.edges.map((edge, index) => ({
    id: `${index}-${edge.sourceId}-${edge.targetId}`,
    source: edge.sourceId,
    target: edge.targetId,
    type: 'straight',
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

    if (node.id.startsWith('label-')) {
      console.log(node?.data.level)

      node.position = {
        x:
          node?.data.level * 6 +
          node.data?.trimester * 200 -
          nodeWidth / 2 +
          50,
        y: -100,
      }
    } else {
      // Adjust the x, y position based on the level and index
      const level = node.data?.course?.level || 1
      const trimester = node.data?.course?.trimester || 1
      const nodesInSameLevel = nodes.filter(
        (n) =>
          n.data?.course?.level === level &&
          n.data?.course.trimester === trimester
      )
      const indexInLevel = nodesInSameLevel.findIndex((n) => n.id === node.id)
      nodeWithPosition.x = level * 6 + trimester * 200
      nodeWithPosition.y = indexInLevel * 120

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      }
    }

    return node
  })

  return { nodes, edges }
}
