class CourseAPI {
  protected static API_URL =
    process.env.REACT_APP_COURSE_API_URL || 'http://localhost:8080'

  static async getPathwayData(completedCourses?: string[]) {
    try {
      const url = new URL(`${CourseAPI.API_URL}/api/courses/pathway`)

      if (completedCourses && completedCourses.length > 0) {
        url.searchParams.append(
          'completedCourses',
          JSON.stringify(completedCourses)
        )
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }
}

export default CourseAPI
