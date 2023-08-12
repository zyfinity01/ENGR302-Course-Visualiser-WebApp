import fetch from 'node-fetch'
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

  var results: Course[] = []
  for (var i = 0; i < courseIds.length; i++) {
    var courseIdAndName = courseIds[i].textContent
    var courseSplit = courseIdAndName.indexOf('–')

    var pointsAndRequirements = coursePoints[i].textContent
    var pointSplit = pointsAndRequirements.indexOf('•')

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
