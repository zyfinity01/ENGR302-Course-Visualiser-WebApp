import GraphingService from '../src/services/GraphingService';
import { Course, CourseStatus } from '../src/models/Course';

describe('GraphingService', () => {
  describe('getNodesAndEdges', () => {
    it('should generate the correct nodes and edges for given courses', () => {
      const courses: Course[] = [
        {
          id: 'SWEN 438',
          name: 'Special Topic: DevOps',
          description: 'Test description',
          points: 15,
          level: 400,
          requirements: '(P) ENGR 302',
          prerequisites: ['ENGR 302'],
          status: CourseStatus.None,
          trimester: 1
        },
        {
          id: 'ENGR 302',
          name: 'Engineering Basics',
          description: 'Test description',
          points: 15,
          level: 300,
          requirements: '',
          prerequisites: [],
          status: CourseStatus.None,
          trimester: 1
        },
      ];

      const graph = GraphingService.getNodesAndEdges(courses);

      // Validate nodes
      expect(graph.nodes).toEqual([
        { id: 'SWEN 438', course: courses[0] },
        { id: 'ENGR 302', course: courses[1] },
      ]);

      // Validate edges based on prerequisites
      expect(graph.edges).toEqual([
        { sourceId: 'ENGR 302', targetId: 'SWEN 438' },
      ]);
    });
  });
});
