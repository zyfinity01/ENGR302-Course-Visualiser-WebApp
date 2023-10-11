import {
  convertToReactFlowFormat,
  getLayoutedElements,
} from '../services/CourseToGraph'
import { Course, CourseStatus } from '../models/course'
import { statusToStyle } from '../nodes/CourseNode'

describe('CourseToGraph', () => {
  // Sample course data for testing
  const sampleCourses: Course[] = [
    {
      id: 'SWEN 438',
      name: 'Special Topic: DevOps',
      description: 'Test description',
      points: 15,
      level: 400,
      requirements: '(P) ENGR 302',
      prerequisites: ['ENGR 302'],
      status: CourseStatus.None,
      trimester: 1,
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
      trimester: 1,
    },
  ]

  describe('convertToReactFlowFormat', () => {
    it('should convert nodes and edges to React Flow format', () => {
      const graph = {
        nodes: sampleCourses.map((course) => ({ id: course.id, course })),
        edges: [{ sourceId: 'ENGR 302', targetId: 'SWEN 438' }],
      }

      const result = convertToReactFlowFormat(graph)

      // Validate nodes and edges conversion
      expect(result.nodes).toHaveLength(4) // 2 courses + 2 labels
      expect(result.edges).toHaveLength(1)
      expect(result.edges[0]).toEqual({
        id: '0-ENGR 302-SWEN 438',
        source: 'ENGR 302',
        target: 'SWEN 438',
        type: 'smoothstep',
        animated: true,
      })
    })

    it('should add custom label nodes based on levels and trimesters', () => {
      const graph = {
        nodes: sampleCourses.map((course) => ({ id: course.id, course })),
        edges: [],
      }

      const result = convertToReactFlowFormat(graph)

      // Validate custom label nodes
      const labelNodes = result.nodes.filter((node) => node.type === 'label')
      expect(labelNodes).toHaveLength(2)
    })
  })

  describe('statusToStyle', () => {
    it('should return the correct style for each course status', () => {
      expect(statusToStyle(CourseStatus.Eligible)).toEqual({
        background: '#58e260',
        color: '#fff',
      })
      expect(statusToStyle(CourseStatus.Ineligible)).toEqual({
        background: '#ff4c23',
        color: '#fff',
      })
      expect(statusToStyle(CourseStatus.Selected)).toEqual({
        borderColor: '#FF0000',
        borderWidth: '5px',
      })
    })
  })

  describe('getLayoutedElements', () => {
    it('should layout nodes and edges correctly', () => {
      const nodes = sampleCourses.map((course) => ({
        id: course.id,
        data: { label: course.id, course },
      }))
      const edges = [{ source: 'ENGR 302', target: 'SWEN 438' }]

      const result = getLayoutedElements(nodes, edges, 100, 50)

      expect(result.nodes).toHaveLength(2)
      expect(result.edges).toHaveLength(1)
    })
  })
})
