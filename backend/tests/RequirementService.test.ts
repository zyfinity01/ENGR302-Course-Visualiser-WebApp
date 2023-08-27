import { type Course } from '../src/models/Course';
import RequirementService from '../src/services/RequirementService';
import { getMockCourse } from './util';

test('set course prerequisites', () => {
  const test1 = getMockCourse('SWEN 325', '(P) NWEN 243, SWEN 225 (or 222)');
  const test2 = getMockCourse('SWEN 325', '(P) NWEN 243 (X) SWEN 225');

  const courses: Course[] = [
    getMockCourse('SWEN 225', ''),
    getMockCourse('SWEN 222', ''),
    getMockCourse('NWEN 243', ''),
    test1,
    test2,
  ];

  RequirementService.setCoursePrerequisites(courses);

  expect(test1.prerequisites).toEqual(['NWEN 243', 'SWEN 225', 'SWEN 222']);
  expect(test2.prerequisites).toEqual(['NWEN 243']);
});
