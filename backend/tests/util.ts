import { Course } from '../src/models/course';

export function getMockCourse(id: string, requirements: string): Course {
  return {
    id: id,
    name: '',
    description: '',
    requirements: requirements,
    points: 15,
    level: 300,
    prerequisites: [],
  };
}
