import { expect, test } from '@jest/globals'
import { getAllCourses } from '../src/services/catprintService'
import { Course } from '../src/models/course'
import { parseCourse } from '../src/services/requirementService'

test('parse courses', async () => {
  const courses = await getAllCourses()

  let output = ''
  for (const course of courses) {
    for (const requirement of parseCourse(course).prerequisites) {
      output += requirement + '\n'
    }
  }

  console.log(output)
})

test('parse course', async () => {
  const course: Course = {
    id: 'SWEN 324',
    name: 'Software Correctness',
    description:
      'This course is concerned with the development of correct software, especially the use of formal requirements and specifications to develop high-integrity software. This has applications in several areas, such as safety-critical systems (e.g. commercial airliners, space systems, etc.) and high-performance concurrent systems. The course will examine a range of principles and techniques which underpin a rigorous approach to the specification and implementation of software. A sequence of assignments and labs will see a range of tools being used to specify small software systems, and to check that they meet their requirements.',
    requirements:
      '(P) COMP 103; ENGR 123 or MATH 161; 30 200-level COMP/NWEN/SWEN points; (X) SWEN 224',
    points: 15,
    level: 300,
  }

  const parsedCourse = parseCourse(course)
  console.log(parsedCourse)
})

test('get all courses', async () => {
  const courses = await getAllCourses()
  expect(courses.length).toBeGreaterThan(0)
})
