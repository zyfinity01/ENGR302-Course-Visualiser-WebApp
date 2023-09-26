import { useState, useEffect } from 'react'
import CourseAPI from '../services/CourseAPI'
import { Course } from '../models/course'

const useFetchCourseData = (completedCourses: string[]) => {
  const [nodeEdgeData, setCourseData] = useState<
    | {
        nodes: [{ id: string; course: Course }]
        edges: [{ sourceId: string; targetId: string }]
      }
    | undefined
  >()

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
  return { nodeEdgeData }
}

export default useFetchCourseData
