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
        id: course.id + ' T' + course.trimester,
        course: course,
      });
    }

    // Create edges based on prerequisites
    for (const course of courses) {
      for (const prereq of course.prerequisites) {
        const prereqCourses = courses.filter((x) => x.id == prereq);
        for (const prereqCourse of prereqCourses) {
          edges.push({
            sourceId: prereqCourse.id + ' T' + prereqCourse.trimester,
            targetId: course.id + ' T' + course.trimester,
          });
        }
      }
    }

    return {
      nodes: nodes,
      edges: edges,
    };
  }
}

export default new GraphingService();
