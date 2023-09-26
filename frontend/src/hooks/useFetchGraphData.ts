import { useState, useEffect } from 'react'
import CourseAPI from '../services/CourseAPI'
import { Course } from '../models/course'

const useFetchCourseData = (completedCourseIds: string[]) => {
  const [nodeEdgeData, setCourseData] = useState<
    | {
        nodes: [{ id: string; course: Course }]
        edges: [{ sourceId: string; targetId: string }]
      }
    | undefined
  >()

  const [completedCourses, setCompletedCourses] =
    useState<string[]>(completedCourseIds)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await CourseAPI.getPathwayData(completedCourses)
        setCourseData(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [completedCourses])
  return { nodeEdgeData, completedCourses, setCompletedCourses }
}

export default useFetchCourseData
