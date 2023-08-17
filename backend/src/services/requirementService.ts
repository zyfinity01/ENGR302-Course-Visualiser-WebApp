import { Course } from '../models/course'

export type ParsedCourse = {
  course: Course
  prerequisites: string[]
  corequisites: string[]
  restrictions: string[]
}

/*
abstract class Requirement {
  constructor(private condition: Condition) {}

  abstract isTrue(): boolean
}

abstract class Condition {}

class AndCondition {}

class PermissionCondition {}
*/

export function parseCourse(course: Course): ParsedCourse {
  return {
    course: course,
    prerequisites: parseRequirements(course, '(P)'),
    corequisites: parseRequirements(course, '(C)'),
    restrictions: parseRequirements(course, '(X)'),
  }
}

function parseRequirements(course: Course, section: string): string[] {
  const requirementSection = parseRequirementSubstring(course, section)
  if (!requirementSection || !requirementSection.trim()) {
    return []
  }

  // enrolment in BE(Hons)
  // COMP 102 or 112, ENGR 101
  // 16 Achievement Standard credits NCEA Level 3 in Mathematics) or (12 Achievement Standard credits NCEA Level 3 Mathematics excluding the statistics standards 91580, 91581, 91582, 91583, 91584) or MATH 132
  // (ENGR 142 or PHYS 142 or 115)
  // ENGR 101, 110 and 45 further points from Part 1 of the BE(Hons) schedule
  // (ENGR 121, 122) or (MATH 142, 151)
  // Permission of Head of School
  // COMP 103.
  // ENGR 121 (or MATH 141 and 151)
  // ENGR 141 (or (PHYS 114 or 101) and (CHEM 114 or 122))
  // EEEN 202 (or ECEN 202), NWEN 241
  // 45 points from AIML 425-440
  // as for ENGR 401
  // 60 300-level points from CGRA, COMP, CYBR, ECEN, EEEN, NWEN, RESE, SWEN

  return requirementSection.split(';').map((x) => x.trim())
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
