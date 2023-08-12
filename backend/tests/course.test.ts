import { expect, test } from '@jest/globals'
import { getAllCourses } from '../src/services/catprintService'

test('get all courses', async () => {
  const courses = await getAllCourses()
  expect(courses.length).toBeGreaterThan(0)
})
