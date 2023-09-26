import { Course, CourseStatus } from '../src/models/Course';
import CatprintService from '../src/services/CatprintService';
import DatastoreService from '../src/services/DatastoreService';

export function getMockCourse(id: string, requirements: string): Course {
  return {
    id: id,
    name: '',
    description: '',
    requirements: requirements,
    points: 15,
    level: 300,
    prerequisites: [],
    status: CourseStatus.None,
    trimester: 1,
  };
}

export async function getCourses(): Promise<Course[]> {
  if (!DatastoreService.hasData()) {
    const courses = await CatprintService.getCourses();
    DatastoreService.saveCourses(courses);
    return courses;
  }

  return DatastoreService.getCourses();
}
