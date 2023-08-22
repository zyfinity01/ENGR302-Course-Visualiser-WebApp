import fs from 'fs';
import path from 'path';
import DatastoreService from '../src/services/DatastoreService';
import { Course } from '../src/models/course';

jest.mock('fs'); // Mock the fs module

describe('DatastoreService', () => {
  const testFilePath = path.join(__dirname, 'data.json');

  beforeEach(() => {
    // Mock fs.writeFileSync to prevent writing to the file system during tests
    (fs.writeFileSync as jest.Mock).mockClear(); // Clear any previous calls
  });

  afterEach(() => {
    // Clean up test file after each test
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('should save courses to a JSON file', () => {
    const courses: Course[] = [
      {
        id: '1',
        name: 'Course 1',
        description: 'aCourse',
        points: 0,
        level: 0,
        requirements: '',
        prerequisites: [],
      },
      {
        id: '2',
        name: 'Course 2',
        description: 'aCourse',
        points: 0,
        level: 0,
        requirements: '',
        prerequisites: [],
      },
    ];

    DatastoreService.saveCourses(courses);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      testFilePath,
      expect.stringContaining("'id': '1'"), // Use single quotes for id
      'utf8'
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      testFilePath,
      expect.stringContaining("'id': '2'"), // Use single quotes for id
      'utf8'
    );
  });
});
