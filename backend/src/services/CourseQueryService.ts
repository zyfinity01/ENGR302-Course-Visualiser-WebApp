import { Course } from '../models/Course';

class CourseQueryService {
  constructor(private courses: Course[]) {}

  /**
   * Search for courses by subject.
   *
   * @param degree Type of course to filter by
   * @returns courses found by query
   */
  getCoursesBySubject(degree: string): Course[] {
    return this.courses.filter((course) => course.id.startsWith(degree));
  }

  /**
   * Find student pathway with known completed courses.
   *
   * @param completedCourses Course IDs of students completed courses
   * @returns courses found that student has completed and can apply for
   */
  getCoursesPathway(completedCourses: string[]): Course[] {
    // Get all completed courses based on the provided ids.
    const matchedCompletedCourses = this.courses.filter((course) =>
      completedCourses.includes(course.id)
    );

    // Get the courses that have any of the completedCourses as prerequisites.
    const pathwayCourses = this.courses.filter((course) => {
      return course.prerequisites.some((prerequisite) =>
        completedCourses.includes(prerequisite)
      );
    });

    const resultCoursesSet = new Set<Course>([
      ...matchedCompletedCourses,
      ...pathwayCourses,
    ]);

    return Array.from(resultCoursesSet);
  }
}

export default CourseQueryService;
