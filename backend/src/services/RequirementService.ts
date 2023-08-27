import { Course } from '../models/Course';

/**
 * These are non-core subjects for engineering,
 * but we need them in the subject list to avoid incorrect matching
 */
const EXTRA_SUBJECTS = ['PHYS', 'STAT', 'INFO', 'QUAN', 'MATH', 'ECEN', 'CHEM'];

class RequirementService {
  /**
   * Sets the prerequisites for each course in the list.
   * @param courses The list of courses to set prerequisites for.
   */
  setCoursePrerequisites(courses: Course[]) {
    const subjects = this.getSubjects(courses);

    for (const course of courses) {
      const prerequisites = this.getRequirementSubstring(course, '(P)');
      const ids = prerequisites.match(/\d{3}/g) || [];

      for (const id of ids) {
        const subject = this.findClosestValueLeftOfIndex(
          prerequisites,
          prerequisites.indexOf(id),
          subjects
        );

        const foundCourse = courses.find(
          (x) => subject && x.id.includes(subject) && x.id.includes(id)
        );

        if (foundCourse) {
          course.prerequisites.push(foundCourse.id);
        }
      }
    }
  }

  /**
   * Retrieves the subject list from courses and adds extra subjects.
   * @param courses The list of courses.
   * @returns A set of subjects.
   */
  private getSubjects(courses: Course[]): Set<string> {
    const subjects = new Set(courses.map((x) => x.id.split(' ')[0]));
    EXTRA_SUBJECTS.forEach((subject) => subjects.add(subject));
    return subjects;
  }

  /**
   * Finds the closest value (from the given set) to the left of the given index in a string.
   * @param search The string to search in.
   * @param index The index to start searching from.
   * @param values A set of values to search for.
   * @returns The closest value or null if none is found.
   */
  private findClosestValueLeftOfIndex(
    search: string,
    index: number,
    values: Set<string>
  ): string | null {
    let closestIndex: number = -1;
    let closest: string | null = null;

    for (const value of values) {
      const valueIndex = search.lastIndexOf(value, index);
      if (valueIndex > closestIndex) {
        closestIndex = valueIndex;
        closest = value;
      }
    }

    return closest;
  }

  /**
   * Retrieves the requirement substring from the course's requirements section.
   * @param course The course object.
   * @param section The section identifier (e.g., "(P)").
   * @returns The requirement substring.
   */
  private getRequirementSubstring(course: Course, section: string): string {
    const index = course.requirements.indexOf(section);
    if (index == -1) {
      return '';
    }

    const offset = index + section.length;
    const after = course.requirements.substring(offset);
    const ending = after.search(/\(P\)|\(X\)|\(C\)|$|\\.\\/);
    if (ending == -1) {
      return after.trim();
    }

    return after.substring(0, ending).trim();
  }
}

export default new RequirementService();
