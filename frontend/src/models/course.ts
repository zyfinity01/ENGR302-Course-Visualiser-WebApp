export enum CourseStatus {
  None,
  Selected,
  Eligible,
  Ineligible,
}

export type Course = {
  id: string
  name: string
  description: string
  points: number
  level: number
  requirements: string
  prerequisites: string[]
  status: CourseStatus
}
