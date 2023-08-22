import {classToPlain } from 'class-transformer';
import fs from 'fs';
import path from 'path';
import { Course } from '../models/course';

class DatastoreService {
  private dataFilePath: string = path.join(__dirname, 'data.json'); // Adjust the file path as needed
  /**
   * @todo
   *
   * Save courses to file.
   * @param courses Courses list to save
   */
  saveCourses(courses: Course[]): void {
    const coursesAsPlainObjects = classToPlain(courses); // Convert class instances to plain objects
    const jsonData = JSON.stringify(coursesAsPlainObjects, null, 2); // Format JSON with 2 spaces indentation

    fs.writeFileSync(this.dataFilePath, jsonData); // Write JSON data to the file
  }
  /**
   * @todo
   *
   * Retrieve courses from file.
   */
  getCourses(): Course[] {
    if (!this.hasData()) throw new Error('No data exists');
    const jsonData = fs.readFileSync(this.dataFilePath, 'utf8');
    return JSON.parse(jsonData) as Course[];
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
