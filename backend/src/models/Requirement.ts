import { Course } from './Course';

export abstract class Requirement {
  constructor(public type: string) {}

  abstract isRequirementMeet(allCourses: Course[], selected: string[]): boolean;

  abstract isParsedCorrect(): boolean;
}

export class AnyRequirement extends Requirement {
  constructor(public conditions: Requirement[]) {
    super('any');
  }

  isRequirementMeet(allCourses: Course[], selected: string[]): boolean {
    return this.conditions.some((x) =>
      x.isRequirementMeet(allCourses, selected)
    );
  }

  isParsedCorrect(): boolean {
    return this.conditions.every((x) => x.isParsedCorrect());
  }
}

export class AndRequirement extends Requirement {
  constructor(public conditions: Requirement[]) {
    super('and');
  }

  isRequirementMeet(allCourses: Course[], selected: string[]): boolean {
    return this.conditions.every((x) =>
      x.isRequirementMeet(allCourses, selected)
    );
  }

  isParsedCorrect(): boolean {
    return this.conditions.every((x) => x.isParsedCorrect());
  }
}

export class PointRequirement extends Requirement {
  constructor(
    public level: number,
    public points: number
  ) {
    super('point');
  }

  isRequirementMeet(courses: Course[], selected: string[]): boolean {
    const points = courses
      .filter((x) => selected.includes(x.id))
      .filter((x) => x.level == this.level)
      .map((x) => x.points)
      .reduce((a, b) => a + b, 0);

    return points >= this.points;
  }

  isParsedCorrect(): boolean {
    return true;
  }
}

export class CourseRequirement extends Requirement {
  constructor(public course: string) {
    super('course');
  }

  isRequirementMeet(_: Course[], selected: string[]): boolean {
    return selected.includes(this.course);
  }

  isParsedCorrect(): boolean {
    return true;
  }
}

export class BadParseRequirement extends Requirement {
  constructor(public value: string) {
    super('bad');
  }

  isRequirementMeet(): boolean {
    return true;
  }

  isParsedCorrect(): boolean {
    return false;
  }
}
