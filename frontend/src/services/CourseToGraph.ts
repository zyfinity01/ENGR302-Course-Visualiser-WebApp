import { Course, CourseStatus } from '../models/course'
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
      style: this.statusToStyle(node.course.status),
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

  static statusToStyle(status: CourseStatus): any {
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
}

export default CourseToGraph
