import CourseQueryService from '../src/services/CourseQueryService';
import { Course, CourseStatus } from '../src/models/Course';

describe('CourseQueryService', () => {
  const courses: Course[] = [
    {
      id: 'SWEN 438',
      name: 'Special Topic: DevOps',
      description: 'Test description for DevOps',
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
      description: 'Test description for Engineering Basics',
      points: 15,
      level: 300,
      requirements: '',
      prerequisites: [],
      status: CourseStatus.None,
      trimester: 1
    },
    {
      id: 'BIO 101',
      name: 'Biology Basics',
      description: 'Test description for Biology Basics',
      points: 10,
      level: 100,
      requirements: '',
      prerequisites: [],
      status: CourseStatus.None,
      trimester: 1
    },
  ];

  const courseService = new CourseQueryService(courses);

  describe('getCoursesByDegree', () => {
    it('should return courses based on the degree prefix', () => {
      const result = courseService.getCoursesBySubject('SWEN');
      expect(result).toEqual([courses[0]]);
    });
  });

  describe('getCoursesPathway', () => {
    it('should return completed courses and courses based on prerequisites', () => {
      const completedCourses = ['ENGR 302'];
      const result = courseService.getCoursesPathway(completedCourses);

      // Both ENGR 302 (completed) and SWEN 438 (because ENGR 302 is a prerequisite for it) should be returned
      expect(result).toEqual([courses[1], courses[0]]);
    });
  });
});
