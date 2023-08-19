import { expect, test } from '@jest/globals'
import { getCatprintCourses } from '../src/services/catprintService'
import { Course } from '../src/models/course'
import { setCoursePrerequisites } from '../src/services/requirementService'

test('get all courses', async () => {
  const courses = await getCatprintCourses()
  expect(courses.length).toBeGreaterThan(0)
})

test('set course prerequisites', () => {
  const test1 = getMockCourse('SWEN 325', '(P) NWEN 243, SWEN 225 (or 222)')
  const test2 = getMockCourse('SWEN 325', '(P) NWEN 243 (X) SWEN 225')

  const courses: Course[] = [
    getMockCourse('SWEN 225', ''),
    getMockCourse('SWEN 222', ''),
    getMockCourse('NWEN 243', ''),
    test1,
    test2,
  ]

  setCoursePrerequisites(courses)

  expect(test1.prerequisites).toEqual(['NWEN 243', 'SWEN 225', 'SWEN 222'])
  expect(test2.prerequisites).toEqual(['NWEN 243'])
})

function getMockCourse(id: string, requirements: string): Course {
  return {
    id: id,
    name: '',
    description: '',
    requirements: requirements,
    points: 15,
    level: 300,
    prerequisites: [],
  }
}
