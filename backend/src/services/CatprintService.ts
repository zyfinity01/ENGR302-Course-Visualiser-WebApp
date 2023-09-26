import { HTMLElement, parse } from 'node-html-parser';
import { Course, CourseStatus } from '../models/Course';

class CatprintService {
  /**
   * Retrieves the courses from all programmes.
   * @returns An array of courses.
   */
  async getCourses() {
    const programmes = [
      { directory: 'Engineering', programme: 'u' },
      { directory: 'Engineering', programme: 'p' },
      { directory: 'Computer%20Science', programme: 'u' },
      { directory: 'Computer%20Science', programme: 'p' },
    ];

    let courses = (
      await Promise.all(
        programmes.map((p) =>
          this.getCoursesForProgramme(p.directory, p.programme)
        )
      )
    ).flat();

    courses = courses
      .filter((x) => !x.name.toLowerCase().startsWith('special topic'))
      .filter((x) => !x.description.toLowerCase().startsWith('to be advised'))
      .filter((x) => !x.description.toLowerCase().startsWith('to be confirmed'))
      .filter((x) => !x.requirements.toLowerCase().includes('permission'))
      .filter((x) => x.level < 500);

    return this.getDuplicateFreeCourses(courses);
  }

  getDuplicateFreeCourses(courses: Course[]): Course[] {
    const duplicateFree = [];
    const seen = new Set<string>();
    for (const course of courses) {
      if (seen.has(course.id + course.trimester)) {
        continue;
      }

      seen.add(course.id + course.trimester);
      duplicateFree.push(course);
    }

    return duplicateFree;
  }

  /**
   * Retrieves the courses for a given programme and directory.
   * @param directory - The directory name (e.g. 'Engineering').
   * @param programme - The programme type (e.g. 'u' or 'p').
   * @returns An array of courses.
   */
  async getCoursesForProgramme(
    directory: string,
    programme: string
  ): Promise<Course[]> {
    const year = new Date().getFullYear();
    const url = `https://service-web.wgtn.ac.nz/dotnet2/catprint.aspx?t=${programme}${year}&d=${directory}`;

    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);

    return this.parseCoursesFromHtml(root);
  }

  /**
   * Parses the provided HTML root to extract course details.
   * @param root - The parsed HTML root.
   * @returns An array of courses.
   */
  private parseCoursesFromHtml(root: HTMLElement): Course[] {
    const results = [];
    const elements = root.querySelectorAll('.Section1 *');

    let courseId = '';
    let courseName = '';
    let description = '';
    let requirements = '';
    let level = 0;
    let points = 0;

    for (const element of elements) {
      if (!element.classNames) {
        continue;
      }

      if (element.classNames.includes('courseid')) {
        const courseIdAndName = element.textContent.split('–');
        courseId = courseIdAndName[0].trim();
        courseName = courseIdAndName[1].trim();
        level = parseInt(courseIdAndName[0].split(' ')[1][0] + '00');
      } else if (element.classNames.includes('subjectsbody')) {
        description = element.textContent;
      } else if (element.classNames.includes('coursepoints')) {
        const pointsAndRequirements = element.textContent.split('•');
        points = parseInt(pointsAndRequirements[0].replace(' pts', '').trim());
        requirements =
          pointsAndRequirements.length > 1
            ? pointsAndRequirements[1].trim()
            : '';
      } else if (element.classNames.includes('timetable')) {
        const trimester = parseInt(
          element.textContent.split('•')[0].trim().split('/')[0]
        );

        results.push({
          id: courseId,
          name: courseName,
          description: description,
          requirements: requirements,
          points: points,
          level: level,
          prerequisites: [],
          status: CourseStatus.None,
          trimester: trimester,
        });
      }
    }

    return results;
  }
}

export default new CatprintService();
