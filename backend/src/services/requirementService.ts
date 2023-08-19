import { Course } from '../models/course'

export type ParsedCourse = {
  course: Course
  prerequisites: Requirement[]
  corequisites: Requirement[]
  restrictions: Requirement[]
}

export abstract class Requirement { }

export class CourseAndRequirement implements Requirement {
  constructor(private courses: Requirement[]) {

  }
}

export class CourseOrRequirement implements Requirement {
  constructor(private courses: string[]) {

  }
}

export class LevelCourseRequirement implements Requirement {
  constructor(private level: number, private points: number, private courses: string[]) {

  }
}

export class NoneRequirement implements Requirement {

}

export class BadParse implements Requirement {
  constructor(value: string) {
    console.log('Failed to parse:\n\t' + value)
  }
}

export function parseCourse(course: Course): ParsedCourse {
  return {
    course: course,
    prerequisites: parseRequirements(course, '(P)'),
    corequisites: parseRequirements(course, '(C)'),
    restrictions: parseRequirements(course, '(X)'),
  }
}

function parseRequirements(course: Course, section: string): Requirement[] {
  const requirementSection = parseRequirementSubstring(course, section)
  if (!requirementSection || !requirementSection.trim()) {
    return []
  }

  const requirements: Requirement[] = []
  const tokens = requirementSection.split(';')
  for (const token of tokens) {
    if (!token) {
      continue
    }

    const requirement = parseRequirement(token.trim())
    requirements.push(requirement)
  }

  return requirements
}

function parseRequirementSubstring(
  course: Course,
  section: string
): string | null {
  const index = course.requirements.indexOf(section)
  if (index == -1) {
    return null
  }

  const offset = index + section.length
  const after = course.requirements.substring(offset)
  const ending = after.search(/\(P\)|\(X\)|\(C\)|$|\\.\\/)
  if (ending == -1) {
    return after.trim()
  }

  return after.substring(0, ending).trim()
}

function parseRequirement(r: string): Requirement {
  return parseAndCourses(r) ||
    parseOrCourses(r) ||
    parsePairCourses(r) ||
    parseLevel(r) ||
    parseNoneRequirement(r) ||
    new BadParse(r)
}

function parseAndCourses(r: string): Requirement | null {
  // COMP 102 or 112, ENGR 101
  if (r.includes(', ')) {
    const courses = r.split(', ').map(r => parseOrCourses(r))
    if (courses != null && courses.length > 0 && courses.every(r => r != null)) {
      return new CourseAndRequirement(courses as Requirement[])
    }
  }

  return null
}

function parseOrCourses(r: string): Requirement | null {
  const courseRegex = /^[A-Z]{4} \d{3}$/
  const numberRegex = /^\d{3}/
  
  const values = r.split(' or ')

  // ENGR 123 or 456 -> ENGR 123 or ENGR 456
  if (courseRegex.test(values[0])) {
    for (let i = 1; i < values.length; i++) {
      if (numberRegex.test(values[i])) {
        values[i] = values[i-1].split(' ')[0] + ' ' + values[i]
      }
    }
  }

  // ENGR 123 or MATH 161
  if (values.every(r => courseRegex.test(r))) {
    return new CourseOrRequirement(values)
  }

  return null
}

function parsePairCourses(r: string): Requirement | null {
  // Any pair (MATH 141/QUAN 111, MATH 151/161/177)

  if (!r.includes('Any pair')) {
    return null
  }

  const test = r.replace('Any pair (', '')
    .replace(')', '')
    .split(', ')
    .map(x => x.split('/').join(', '))

  const values = r.replace('Any pair (', '')
    .replace(')', '')
    .split(', ')
    .map(x => x.split('/').join(', '))
    .map(x => parseAndCourses(x))
  
  console.log(test)
  console.log(JSON.stringify(values, null, 4))

  if (values && values.length > 0 && values.every(x => x != null)) {
    return values
  }

  return null
}

function parseLevel(r: string): Requirement | null {
  // 30 200-level COMP/NWEN/SWEN points
  if (/^\d{2} \d{3}-level (.)* points/.test(r)) {
    const tokens = r.split(' ')
    const points = parseInt(tokens[0])
    const level = parseInt(tokens[1].split('-')[0])
    const courses = tokens[2].split('/')
    return new LevelCourseRequirement(level, points, courses)
  }

  return null
}

function parseNoneRequirement(r: string): Requirement | null {
  // enrolment in BE(Hons)
  if (r == 'enrolment in BE(Hons)') {
    return new NoneRequirement()
  }

  return null
}