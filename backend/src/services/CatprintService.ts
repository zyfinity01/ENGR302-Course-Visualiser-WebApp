import { HTMLElement, parse } from 'node-html-parser';
import { Course } from '../models/Course';

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

    const courses = (
      await Promise.all(
        programmes.map((p) =>
          this.getCoursesForProgramme(p.directory, p.programme)
        )
      )
    ).flat();

    return courses;
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
    const courseIds = root.querySelectorAll('.courseid');
    const subjectBodies = root.querySelectorAll('.subjectsbody');
    const coursePoints = root.querySelectorAll('.coursepoints');

    const results: Course[] = [];
    for (let i = 0; i < courseIds.length; i++) {
      const courseIdAndName = courseIds[i].textContent.split('–');
      const pointsAndRequirements = coursePoints[i].textContent.split('•');
      const points = parseInt(
        pointsAndRequirements[0].replace(' pts', '').trim()
      );
      const requirements =
        pointsAndRequirements.length > 1 ? pointsAndRequirements[1].trim() : '';
      const level = parseInt(courseIdAndName[0].split(' ')[1][0] + '00');

      results.push({
        id: courseIdAndName[0].trim(),
        name: courseIdAndName[1].trim(),
        description: subjectBodies[i].textContent,
        requirements: requirements,
        points: points,
        level: level,
        prerequisites: [],
      });
    }

    return results;
  }
}

export default new CatprintService();
