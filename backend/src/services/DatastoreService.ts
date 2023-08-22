import { Course } from '../models/course';

class DatastoreService {
  /**
   * @todo
   *
   * Save courses to file.
   * @param courses Courses list to save
   */
  saveCourses(courses: Course[]): void {
    console.log(courses);
  }
  /**
   * @todo
   *
   * Retrieve courses from file.
   */
  getCourses(): Course[] {
    if (!this.hasData()) throw new Error('No data exists');
    return [];
  }
  /**
   * @todo
   *
   * Check if data already exists.
   * @returns true if data exists
   */
  hasData(): boolean {
    // todo
    return false;
  }
  /**
   * @todo
   *
   * Get the time the last save happened.
   * @returns time since last update (zero if no data exists)
   */
  getLastUpdatedTime(): number {
    return 0;
  }
}

export default new DatastoreService();
