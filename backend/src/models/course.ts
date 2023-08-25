import { Type } from 'class-transformer';

export class Course {
  @Type(() => String)
  id: string;
  name: string;
  description: string;
  points: number;
  level: number;
  requirements: string;
  prerequisites: string[];
}
