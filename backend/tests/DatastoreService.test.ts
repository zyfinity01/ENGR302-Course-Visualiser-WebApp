import fs from 'fs';
import path from 'path';
import DatastoreService from '../src/services/DatastoreService'; // Update this import path
import { Course, CourseStatus } from '../src/models/Course';

// Mocking the fs and path modules
jest.mock('fs');
jest.mock('path');

describe('DatastoreService', () => {
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Test Course',
      description: 'This is a test course',
      points: 100,
      level: 1,
      requirements: 'None',
      prerequisites: [],
      status: CourseStatus.None,
      trimester: 1,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveCourses', () => {
    it('should save courses to file', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      DatastoreService.saveCourses(mockCourses);

      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './data/courses.json',
        JSON.stringify(mockCourses, null, 2)
      );
    });
  });

  describe('getCourses', () => {
    it('should retrieve courses from file', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCourses)
      );

      const result = DatastoreService.getCourses();

      expect(result).toEqual(mockCourses);
    });

    it('should throw error if no data exists', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(() => DatastoreService.getCourses()).toThrow('No data exists');
    });
  });

  describe('hasData', () => {
    it('should return true if data exists', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      expect(DatastoreService.hasData()).toBe(true);
    });

    it('should return false if data does not exist', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(DatastoreService.hasData()).toBe(false);
    });
  });

  describe('getLastUpdatedTime', () => {
    it('should return time since last update', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({
        mtime: new Date('2023-08-25T10:00:00Z'),
      });

      const result = DatastoreService.getLastUpdatedTime();

      expect(result).toBe(new Date('2023-08-25T10:00:00Z').getTime());
    });

    it('should return zero if no data exists', () => {
      (path.join as jest.Mock).mockReturnValue('./data/courses.json');
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(DatastoreService.getLastUpdatedTime()).toBe(0);
    });
  });
});
