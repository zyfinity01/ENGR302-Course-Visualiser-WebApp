import { parse } from 'node-html-parser'
import { Course } from '../models/course'
import { setCoursePrerequisites } from './requirementService'

export async function getCatprintCourses() {
  const [r1, r2, r3, r4] = await Promise.all([
    getCoursesForProgramme('Engineering', 'u'),
    getCoursesForProgramme('Engineering', 'p'),
    getCoursesForProgramme('Computer%20Science', 'u'),
    getCoursesForProgramme('Computer%20Science', 'p'),
  ])

  const courses = [...r1, ...r2, ...r3, ...r4]
  setCoursePrerequisites(courses)

  return courses
}

async function getCoursesForProgramme(
  directory: string,
  programme: string
): Promise<Course[]> {
  const year = new Date().getFullYear()
  const url = `https://service-web.wgtn.ac.nz/dotnet2/catprint.aspx?t=${programme}${year}&d=${directory}`

  const response = await fetch(url)
  const html = await response.text()
  const root = parse(html)

  const courseIds = root.querySelectorAll('.courseid')
  const subjectBodies = root.querySelectorAll('.subjectsbody')
  const coursePoints = root.querySelectorAll('.coursepoints')

  const results: Course[] = []
  for (let i = 0; i < courseIds.length; i++) {
    const courseIdAndName = courseIds[i].textContent.split('–')
    const pointsAndRequirements = coursePoints[i].textContent.split('•')
    const points = parseInt(pointsAndRequirements[0].replace(' pts', '').trim())
    const requirements =
      pointsAndRequirements.length > 1 ? pointsAndRequirements[1].trim() : ''
    const level = parseInt(courseIdAndName[0].split(' ')[1][0] + '00')

    results.push({
      id: courseIdAndName[0].trim(),
      name: courseIdAndName[1].trim(),
      description: subjectBodies[i].textContent,
      requirements: requirements,
      points: points,
      level: level,
      prerequisites: [],
    })
  }

  return results
}
