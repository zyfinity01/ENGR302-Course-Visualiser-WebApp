import { Course } from '../models/course'
import { Node, Edge } from '../components/Graph'

interface Graph {
  nodes: { id: string; course: Course }[]
  edges: { sourceId: string; targetId: string }[]
}

class CourseToGraph {
  static convertToReactFlowFormat(graph: Graph): {
    nodes: Node[]
    edges: Edge[]
  } {
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
}

export default CourseToGraph
