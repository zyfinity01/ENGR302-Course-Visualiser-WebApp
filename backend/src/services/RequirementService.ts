import { Course, CourseStatus } from '../models/Course';
import {
  AndRequirement,
  AnyRequirement,
  BadParseRequirement,
  CourseRequirement,
  PointRequirement,
  Requirement,
} from '../models/Requirement';

/**
 * These are non-core subjects for engineering,
 * but we need them in the subject list to avoid incorrect matching
 */
const EXTRA_SUBJECTS = [
  'PHYS',
  'STAT',
  'INFO',
  'QUAN',
  'MATH',
  'ECEN',
  'CHEM',
  'DSDN',
  'DATA',
  'PHIL',
];

class RequirementService {
  private subjects: Set<string>;

  /**
   * Retrieves the subject list from courses and adds extra subjects.
   * @param courses The list of courses.
   * @returns A set of subjects.
   */
  setSubjects(courses: Course[]) {
    this.subjects = new Set(courses.map((x) => x.id.split(' ')[0]));
    EXTRA_SUBJECTS.forEach((subject) => this.subjects.add(subject));
  }

  /**
   * Sets the course eligibility based on the selected courses.
   * @param courses The list of courses
   * @param selectedCourses The list of selected courses
   */
  setCourseStatus(courses: Course[], selectedCourses: string[]) {
    this.setSubjects(courses);

    for (const course of courses) {
      const isSelected = selectedCourses.includes(course.id);
      if (isSelected) {
        course.status = CourseStatus.Selected;
        continue;
      }

      const prerequisites = this.extractAndParseRequirements(course, '(P)');
      const corestrictions = this.extractAndParseRequirements(course, '(C)');
      const restrictions = this.extractAndParseRequirements(course, '(X)');

      const isEligible =
        prerequisites.every((x) =>
          x.isRequirementMet(courses, selectedCourses)
        ) &&
        corestrictions.every(
          (x) => !x.isRequirementMet(courses, selectedCourses)
        ) &&
        restrictions.every(
          (x) => !x.isRequirementMet(courses, selectedCourses)
        );

      course.status = isEligible
        ? CourseStatus.Eligible
        : CourseStatus.Ineligible;
    }
  }

  /**
   * Sets the prerequisites for each course in the list.
   * @param courses The list of courses to set prerequisites for.
   */
  setCoursePrerequisites(courses: Course[]) {
    this.setSubjects(courses);

    for (const course of courses) {
      const prerequisites = this.getRequirementSubstring(course, '(P)');
      const ids = prerequisites.match(/\d{3}/g) || [];

      for (const id of ids) {
        const subject = this.findClosestValueLeftOfIndex(
          prerequisites,
          prerequisites.indexOf(id),
          this.subjects
        );

        const foundCourse = courses.find(
          (x) => subject && x.id.includes(subject) && x.id.includes(id)
        );

        if (foundCourse) {
          course.prerequisites.push(foundCourse.id);
        }
      }
    }
  }

  /**
   * Parses a sub-part of the requirements (i.e (P), (X), or (C))
   * @param course The course to parse
   * @param section The requirement sub-part to parse
   * @returns
   */
  extractAndParseRequirements(course: Course, section: string): Requirement[] {
    const prerequisites = this.getRequirementSubstring(course, section);
    return this.parseRequirementsSection(prerequisites);
  }

  /**
   * Parses the requirement string
   * @param r The requirement to parse
   * @returns The parsed requirements
   */
  parseRequirementsSection(r: string): Requirement[] {
    return r
      .split(';')
      .map((x) => this.parseRequirement(x))
      .filter((x) => x != null);
  }

  /**
   * Parses a single requirement string
   * @param r The requirement to parse
   * @returns The parsed requirement
   */
  parseRequirement(r: string): Requirement {
    r = this.formatRequirement(r);

    if (r == '') {
      return null;
    }

    // course requirement
    if (/^[A-Z]{4} \d{3}$/.test(r)) {
      return new CourseRequirement(r);
    }

    // level requirement
    if (/^\d{2} \d{3}-level points$/.test(r)) {
      const split = r.split(' ');
      const number = parseInt(split[0]);
      const level = parseInt(split[1].replace('-level', ''));
      return new PointRequirement(level, number);
    }

    // tokenize for further extraction
    const tokens = this.getTokens(r);
    if (tokens.length == 1 && !r.startsWith('(')) {
      return new BadParseRequirement(r);
    }

    // and / or requierments
    let result: Requirement = null;
    for (const token of tokens) {
      if (token == '/') {
        if (!(result instanceof AnyRequirement)) {
          result = new AnyRequirement([result]);
        }
      } else if (token == ',') {
        if (!(result instanceof AndRequirement)) {
          result = new AndRequirement([result]);
        }
      } else if (!result) {
        result = this.parseRequirement(token);
      } else {
        if (result instanceof AnyRequirement) {
          result.conditions.push(this.parseRequirement(token));
        } else if (result instanceof AndRequirement) {
          result.conditions.push(this.parseRequirement(token));
        }
      }
    }

    return result;
  }

  /**
   * Turns a requirement into tokens
   * @param r The requirement to parse
   * @returns The tokens
   */
  getTokens(r: string): string[] {
    const tokens = [];

    let token = '';
    let brackets = 0;
    for (const character of r) {
      if (character == '(') {
        if (++brackets != 1) {
          token += character;
        }
      } else if (character == ')') {
        if (--brackets != 0) {
          token += character;
        } else {
          tokens.push(token.trim());
          token = '';
        }
      } else if (brackets == 0 && (character == ',' || character == '/')) {
        if (token.trim()) {
          tokens.push(token.trim());
        }
        tokens.push(character);
        token = '';
      } else {
        token += character;
      }
    }

    if (token.trim()) {
      tokens.push(token.trim());
    }

    return tokens;
  }

  /**
   * Formats a requirement to be parser-friendly
   * @param r The requirement
   * @returns The cleaned string
   */
  formatRequirement(r: string): string {
    r = this.formatIrrelevant(r);
    r = this.formatCourseIds(r);
    r = this.formatPoints(r);
    r = this.formatThePair(r);
    r = this.formatAnyPair(r);
    r = this.formatOneOf(r);
    r = this.formatAsFor(r);
    r = this.formatJoins(r);

    return r.trim();
  }

  /**
   * Formats point-specific requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatPoints(r: string): string {
    r = r.replace(
      'points from Part 1 of the BE(Hons) schedule',
      '100-level points'
    );
    r = r.replace('300-level pts', '300-level points');
    r = r.replace('-level pts', '-level points');
    r = r.replace('15 points from', 'one of');
    r = r.replace('45 points from AIML 425-AIML 440', '45 400-level points');
    r = r.replace(
      'pts from (COMP 261, NWEN 241, NWEN 243, SWEN 222, SWEN 225)',
      '200-level points'
    );
    r = r.replace('one 300-level course', '30 300-level points');

    return r;
  }

  /**
   * Formats join-specific requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatJoins(r: string): string {
    r = r.split('(or ').join('or (');
    r = r.split(' or ').join(' / ');
    r = r.split(' and ').join(', ');

    return r;
  }

  /**
   * Formats pair-specific requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatThePair(r: string): string {
    r = r.replace('The pair', 'the pair');
    if (!r.includes('the pair')) {
      return r;
    }

    // the pair (...)
    if (r.match(/the pair \(.*\)/)) {
      r = r.replace('the pair (', '');
      r = r.replace(')', '');
      return r;
    }

    // the pair SUBJ NUM, (...)
    if (r.match(/the pair [A-Z]{4} \d{3}, \(.*\)/)) {
      r = r.replace('the pair ', '');
      r = r.replace(' or ', ' / ');
      const index = r.indexOf(',') + 1;
      const substr = r.slice(index);
      return r.replace(substr, substr.replace(', ', ' / '));
    }

    return r;
  }

  /**
   * Formats any-pair specific requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatAnyPair(r: string): string {
    r = r.replace('Any pair', 'any pair');
    r = r.replace('two courses from', 'any pair');

    if (!r.includes('any pair')) {
      return r;
    }

    const substr = r.slice(r.indexOf('any pair'));
    const ids = r.match(/[A-Z]{4} \d{3}(?!-)/g) || [];
    const rules = [];
    for (const id of ids) {
      const subIds = ids.filter((x) => x != id).join(' / ');
      rules.push(`(${id}, (${subIds}))`);
    }

    return r.replace(substr, '(' + rules.join(' / ') + ')');
  }

  /**
   * Formats one-off specific requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatOneOf(r: string): string {
    r = r.replace('One of', 'one of');
    r = r.replace('one course from', 'one of');

    if (!r.includes('one of')) {
      return r;
    }

    const index = r.indexOf('one of');
    const substr = r.slice(index);

    let replace = substr.replace('one of ', '').replace(', ', ' or ');

    if (!replace.includes('(')) {
      replace = '(' + replace + ')';
    }

    return r.replace(substr, replace);
  }

  /**
   * Formats as-for specific requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatAsFor(r: string): string {
    if (r == 'as for ENGR 401') {
      return 'ENGR 201, ENGR 301, ENGR 302, 45 300-level points';
    }

    return r;
  }

  /**
   * Formats irrelevant requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatIrrelevant(r: string): string {
    r = r.replace('enrolment in BE(Hons)', '');
    r = r.replace('from the BE(Hons) Schedule', '');
    r = r.replace('further ', '');
    r = r.replace(
      'or approved levels of achievement in NCEA Level 3 Physics and Calculus or equivalent',
      ''
    );
    r = r.replace(
      '14 NCEA Level 3 Achievement Standard credits in Digital Technology including 6 credits in Computer Programming, or COMP 132, or equivalent programming experience',
      ''
    );
    r = r.replace('in 2019-2020', '');
    r = r.replace('(2016-2018)', '');
    r = r.replace('in 2014-15', '');
    r = r.replace('in 2014–2016', '');
    r = r.replace('in 2017-2018', '');
    r = r.replace('in 2020-2021', '');
    r = r.replace('in 2021-2022', '');
    r = r.replace('or equivalent', '');
    r = r.replace('or comparable background in Statistics', '');
    r = r.replace('or approved background in Statistics', '');
    r = r.replace('or approved background in Maths or Statistics', '');
    r = r.replace('or approved background in Mathematics or Statistics', '');
    r = r.replace(
      '16 Achievement Standard credits NCEA Level 3 in Mathematics) or (12 Achievement Standard credits NCEA Level 3 Mathematics excluding the statistics standards 91580, 91581, 91582, 91583, 91584) or MATH 132',
      ''
    );
    r = r.replace('at least a B in both', '(');
    r = r.replace('at least a B in ', '');
    r = r.replace('at least B- in', '(');
    r = r.replace('Permission of Head of School', '');
    r = r.replace('Satisfactory completion of Part 1 of the BE(Hons),', '');
    r = r.replace('from (CYBR, COMP, ECEN, EEEN, NWEN, RESE, SWEN)', '');
    r = r.replace('from CGRA, COMP, CYBR, ECEN, EEEN, NWEN, RESE, SWEN', '');
    r = r.replace('from (CYBR, NWEN, SWEN 324, 326)', '');
    r = r.replace('from (AIML, CGRA, COMP, CYBR, NWEN, SWEN)', '');
    r = r.replace('COMP/NWEN/SWEN ', '');
    r = r.replace('COMP, ECEN, NWEN or SWEN ', '');
    r = r.replace('from (COMP, ECEN, NWEN, SWEN)', '');
    r = r.replace('from (COMP, SWEN)', '');
    r = r.replace('from (COMP, NWEN, SWEN)', '');
    r = r.replace('from (COMP, NWEN 303, SWEN)', '');
    r = r.replace('COMP, NWEN or SWEN ', '');
    r = r.replace('COMP, SWEN or NWEN ', '');
    r = r.replace('CGRA/COMP/SWEN/NWEN ', '');
    r = r.replace('COMP or SWEN points', 'pts');
    r = r.replace('of COMP, NWEN, SWEN', '');
    r = r.replace(' CGRA, COMP, CYBR, DATA, SWEN or NWEN', '');
    r = r.replace(' CGRA, COMP, CYBR, DATA, NWEN, or SWEN', '');
    r = r.replace(' COMP, DATA, MATH, NWEN, STAT or SWEN', '');
    r = r.replace('Admission to the MEP', '');
    r = r.replace('Part 1 of the MEP', '');
    r = r.replace('either', '');
    r = r.replace(' recommended', '');
    r = r.replace('SWEN pts', 'pts');

    return r;
  }

  /**
   * Formats course ids in the requirements
   * @param r The requirement string
   * @returns The cleaned string
   */
  private formatCourseIds(r: string): string {
    const ids = r.match(/\d{3}(?!-)/g) || [];

    for (const id of ids) {
      const subject = this.findClosestValueLeftOfIndex(
        r,
        r.indexOf(id),
        this.subjects
      );

      if (subject && !r.includes(subject + ' ' + id)) {
        r = r.replace(id, subject + ' ' + id);
      }
    }

    return r;
  }

  /**
   * Finds the closest value (from the given set) to the left of the given index in a string.
   * @param search The string to search in.
   * @param index The index to start searching from.
   * @param values A set of values to search for.
   * @returns The closest value or null if none is found.
   */
  private findClosestValueLeftOfIndex(
    search: string,
    index: number,
    values: Set<string>
  ): string | null {
    let closestIndex: number = -1;
    let closest: string | null = null;

    for (const value of values) {
      const valueIndex = search.lastIndexOf(value, index);
      if (valueIndex > closestIndex) {
        closestIndex = valueIndex;
        closest = value;
      }
    }

    return closest;
  }

  /**
   * Retrieves the requirement substring from the course's requirements section.
   * @param course The course object.
   * @param section The section identifier (e.g., "(P)").
   * @returns The requirement substring.
   */
  private getRequirementSubstring(course: Course, section: string): string {
    const index = course.requirements.indexOf(section);
    if (index == -1) {
      return '';
    }

    const offset = index + section.length;
    const after = course.requirements.substring(offset);
    const ending = after.search(/\(P\)|\(D\)|\(X\)|\(C\)|\.|$/);
    if (ending == -1) {
      return after.trim();
    }

    return after.substring(0, ending).trim();
  }
}

export default new RequirementService();
