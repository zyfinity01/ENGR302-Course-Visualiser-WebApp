import fs from 'fs';
import path from 'path';
import { Course } from '../models/Course';

class DatastoreService {
  private savePath: string = process.env.DATA_SAVE_PATH || './data';
  /**
   *
   * Save courses to file.
   * @param courses Courses list to save
   */
  saveCourses(courses: Course[]): void {
    const jsonData = JSON.stringify(courses, null, 2); // Format JSON with 2 spaces indentation

    fs.mkdirSync(this.savePath, { recursive: true });
    fs.writeFileSync(this.getFilePath(), jsonData); // Write JSON data to the file
  }
  /**
   * Retrieve courses from file.
   *
   */
  getCourses(): Course[] {
    if (!this.hasData()) throw new Error('No data exists');
    const jsonData = fs.readFileSync(this.getFilePath(), 'utf8');
    return JSON.parse(jsonData) as Course[];
  }
  /**
   * Check if data already exists.
   *
   * @returns true if data exists
   */
  hasData(): boolean {
    return fs.existsSync(this.getFilePath());
  }
  /**
   * Get the time the last save happened.
   *
   * @returns time since last update (zero if no data exists)
   */
  getLastUpdatedTime(): number {
    if (!this.hasData()) return 0;
    const stats = fs.statSync(this.getFilePath());
    return stats.mtime.getTime(); //return unix ms since epoch
  }
  /**
   * Get file path of save file
   * @returns file path
   */
  private getFilePath(): string {
    return path.join(this.savePath, 'courses.json');
  }
}

export default new DatastoreService();
