import { Course } from '../models/course'

export function setCoursePrerequisites(courses: Course[]) {
  const subjects = getSubjects(courses)

  for (const course of courses) {
    const prerequisites = getRequirementSubstring(course, '(P)')
    const ids = prerequisites.match(/\d{3}/g) || []

    for (const id of ids) {
      const subject = findClosestValueLeftOfIndex(
        prerequisites,
        prerequisites.indexOf(id),
        subjects
      )

      const foundCourse = courses.find(
        (x) => subject && x.id.includes(subject) && x.id.includes(id)
      )

      if (foundCourse) {
        course.prerequisites.push(foundCourse.id)
      }
    }
  }
}

function getSubjects(courses: Course[]): Set<string> {
  const subjects = new Set(courses.map((x) => x.id.split(' ')[0]))

  // these are non-core subjects for engineering,
  // but we need them in the subject list to avoid incorrect matching
  const extraSubjects = ['PHYS', 'STAT', 'INFO', 'QUAN', 'MATH', 'ECEN', 'CHEM']

  extraSubjects.forEach((subject) => {
    subjects.add(subject)
  })

  return subjects
}

function findClosestValueLeftOfIndex(
  search: string,
  index: number,
  values: Set<string>
): string | null {
  let closestIndex: number = -1
  let closest: string | null = null

  for (const value of values) {
    const valueIndex = search.lastIndexOf(value, index)
    if (valueIndex > closestIndex) {
      closestIndex = valueIndex
      closest = value
    }
  }

  return closest
}

function getRequirementSubstring(course: Course, section: string): string {
  const index = course.requirements.indexOf(section)
  if (index == -1) {
    return ''
  }

  const offset = index + section.length
  const after = course.requirements.substring(offset)
  const ending = after.search(/\(P\)|\(X\)|\(C\)|$|\\.\\/)
  if (ending == -1) {
    return after.trim()
  }

  return after.substring(0, ending).trim()
}
