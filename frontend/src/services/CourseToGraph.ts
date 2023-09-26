import { Course, CourseStatus } from '../models/course'
import { Node, Edge } from '../components/Graph'
import dagre from 'dagre'

interface Graph {
  nodes: { id: string; course: Course }[]
  edges: { sourceId: string; targetId: string }[]
}

export function convertToReactFlowFormat(graph: Graph): {
  nodes: Node[]
  edges: Edge[]
} {
  const nodes: Node[] = graph.nodes.map((node) => ({
    id: node.id,
    data: { label: node.course.id, course: node.course },
    style: statusToStyle(node.course.status),
  }))

  // Adding Custom Label Nodes
  const levels = new Set(nodes.map((node) => node.data.course.level))
  const trimesters = new Set(nodes.map((node) => node.data.course.trimester))
  levels.forEach(level => {
    trimesters.forEach(trimester => {
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
    type: 'smoothstep',
    animated: true,
  }))

  return {
    nodes,
    edges,
  }
}

export function statusToStyle(status: CourseStatus): any {
  switch (status) {
    case CourseStatus.Eligible:
      return {
        background: '#58e260',
        color: '#fff',
      }
    case CourseStatus.Ineligible:
      return {
        background: '#ff4c23',
        color: '#fff',
      }
    case CourseStatus.None:
    case CourseStatus.Selected:
      return {}
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
        x: (node?.data.level * 6) + (node.data?.trimester * 170) - (nodeWidth / 2) + 50,
        y: -100,
      }
    }
    else {
      // Adjust the x, y position based on the level and index
      const level = node.data?.course?.level || 1;
      const trimester = node.data?.course?.trimester || 1;
      const nodesInSameLevel = nodes.filter(n => n.data?.course?.level === level && n.data?.course.trimester === trimester);
      const indexInLevel = nodesInSameLevel.findIndex(n => n.id === node.id);
      nodeWithPosition.x = (level * 6) + (trimester * 170);
      nodeWithPosition.y = indexInLevel * 70;

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
