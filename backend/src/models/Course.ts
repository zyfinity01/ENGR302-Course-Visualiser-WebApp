export enum CourseStatus {
  None,
  Selected,
  Eligible,
  Ineligible,
}

export class Course {
  id: string;
  name: string;
  description: string;
  points: number;
  level: number;
  requirements: string;
  prerequisites: string[];
  status: CourseStatus;
}
