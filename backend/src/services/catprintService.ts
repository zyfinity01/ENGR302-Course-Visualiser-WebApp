import { parse } from 'node-html-parser'
import { Course } from '../models/course'

export async function getAllCourses() {
  const [resultsU, resultsP] = await Promise.all([
    getCoursesForProgramme('u'), // undergraduate
    getCoursesForProgramme('p'), // postgraduate
  ])

  return [...resultsU, ...resultsP]
}

async function getCoursesForProgramme(programme: string): Promise<Course[]> {
  const year = new Date().getFullYear()
  const url = `https://service-web.wgtn.ac.nz/dotnet2/catprint.aspx?t=${programme}${year}`

  const response = await fetch(url)
  const html = await response.text()
  const root = parse(html)

  const courseIds = root.querySelectorAll('.courseid')
  const subjectBodies = root.querySelectorAll('.subjectsbody')
  const coursePoints = root.querySelectorAll('.coursepoints')

  const results: Course[] = []
  for (let i = 0; i < courseIds.length; i++) {
    const courseIdAndName = courseIds[i].textContent
    const courseSplit = courseIdAndName.indexOf('–')

    const pointsAndRequirements = coursePoints[i].textContent
    const pointSplit = pointsAndRequirements.indexOf('•')

    results.push({
      id: courseIdAndName.substring(0, courseSplit).trim(),
      name: courseIdAndName.substring(courseSplit + 1).trim(),
      description: subjectBodies[i].textContent,
      points:
        pointSplit == -1
          ? pointsAndRequirements
          : pointsAndRequirements.substring(0, pointSplit).trim(),
      requirements:
        pointSplit == -1
          ? ''
          : pointsAndRequirements.substring(pointSplit + 1).trim(),
    })
  }

  return results
}
