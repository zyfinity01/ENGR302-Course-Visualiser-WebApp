import { Course } from '../models/Course';
import { Graph } from '../models/Graph';
import { Node } from '../models/Node';
import { Edge } from '../models/Edge';

class GraphingService {
  /**
   * Find nodes and edges of course relationships by prerequisites.
   *
   * @param courses courses to map
   * @returns graphed course result
   */
  getNodesAndEdges(courses: Course[]): Graph {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create nodes for every course
    for (const course of courses) {
      nodes.push({
        id: course.id,
        course: course,
      });
    }

    // Create edges based on prerequisites
    for (const course of courses) {
      for (const prereq of course.prerequisites) {
        edges.push({
          sourceId: prereq,
          targetId: course.id,
        });
      }
    }

    return {
      nodes: nodes,
      edges: edges,
    };
  }
}

export default new GraphingService();
