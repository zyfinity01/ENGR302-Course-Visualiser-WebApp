import { CourseStatus, type Course } from '../src/models/Course';
import {
  AndRequirement,
  AnyRequirement,
  CourseRequirement,
  PointRequirement,
  Requirement,
} from '../src/models/Requirement';
import RequirementService from '../src/services/RequirementService';
import { getCourses, getMockCourse } from './util';

test('parse all courses', async () => {
  const courses = await getCourses();
  RequirementService.setSubjects(courses);

  for (const course of courses) {
    const prerequisites = RequirementService.extractAndParseRequirements(
      course,
      '(P)'
    );
    const corequisites = RequirementService.extractAndParseRequirements(
      course,
      '(C)'
    );
    const restrictions = RequirementService.extractAndParseRequirements(
      course,
      '(X)'
    );

    const isParsedCorrect =
      prerequisites.every((x) => x.isParsedCorrect()) &&
      corequisites.every((x) => x.isParsedCorrect()) &&
      restrictions.every((x) => x.isParsedCorrect());

    expect(isParsedCorrect).toEqual(true);
  }
});

test('tokenize', () => {
  const result = RequirementService.getTokens(
    'COMP 102 / (COMP 103, (ENGR101 / SWEN 123))'
  );
  expect(result).toEqual(['COMP 102', '/', 'COMP 103, (ENGR101 / SWEN 123)']);
});

test('format 1', async () => {
  await tryFormat('enrolment in BE(Hons)', '');
});

test('format 2', async () => {
  await tryFormat('COMP 102 or 112, ENGR 101', 'COMP 102 / COMP 112, ENGR 101');
});

test('format 3', async () => {
  await tryFormat(
    'the pair MATH 161, (MATH 177, QUAN 102 or STAT 193)',
    'MATH 161, (MATH 177 / QUAN 102 / STAT 193)'
  );
});

test('format 4', async () => {
  await tryFormat(
    'AIML 131 or 60 200-level points or at least a B in DATA 101',
    'AIML 131 / 60 200-level points / DATA 101'
  );
});

test('format 5', async () => {
  await tryFormat('one of (COMP 103, 132)', '(COMP 103 / COMP 132)');
});

test('format 6', async () => {
  await tryFormat(
    'EEEN 313, one of (ENGR 222, MATH 244)',
    'EEEN 313, (ENGR 222 / MATH 244)'
  );
});

test('format 7', async () => {
  await tryFormat(
    'ENGR 123 or (MATH 161, one of MATH 177, QUAN 102 or STAT 193)',
    'ENGR 123 / (MATH 161, (MATH 177 / QUAN 102 / STAT 193))'
  );
});

test('format 8', async () => {
  await tryFormat(
    'one of (COMP 309, EEEN 325 (or ECEN 301)',
    '(COMP 309 / EEEN 325 / (ECEN 301)'
  );
});

test('format 9', async () => {
  await tryFormat(
    'Any pair (MATH 141/QUAN 111, MATH 151/161/177)',
    '((MATH 141, (QUAN 111 / MATH 151 / MATH 161 / MATH 177)) / (QUAN 111, (MATH 141 / MATH 151 / MATH 161 / MATH 177)) / (MATH 151, (MATH 141 / QUAN 111 / MATH 161 / MATH 177)) / (MATH 161, (MATH 141 / QUAN 111 / MATH 151 / MATH 177)) / (MATH 177, (MATH 141 / QUAN 111 / MATH 151 / MATH 161)))'
  );
});

test('format 10', async () => {
  await tryFormat(
    'ENGR 101, 110 and 45 further points from Part 1 of the BE(Hons) schedule',
    'ENGR 101, ENGR 110, 45 100-level points'
  );
});

test('format 11', async () => {
  await tryFormat(
    '60 300-level CGRA, COMP, CYBR, DATA, NWEN, or SWEN pts',
    '60 300-level points'
  );
});

test('parse 1', async () => {
  await tryParse('COMP 102 or 112, ENGR 101', [
    new AndRequirement([
      new AnyRequirement([
        new CourseRequirement('COMP 102'),
        new CourseRequirement('COMP 112'),
      ]),
      new CourseRequirement('ENGR 101'),
    ]),
  ]);
});

test('parse 2', async () => {
  await tryParse('the pair MATH 161, (MATH 177, QUAN 102 or STAT 193)', [
    new AndRequirement([
      new CourseRequirement('MATH 161'),
      new AnyRequirement([
        new CourseRequirement('MATH 177'),
        new CourseRequirement('QUAN 102'),
        new CourseRequirement('STAT 193'),
      ]),
    ]),
  ]);
});

test('parse 3', async () => {
  await tryParse('the pair (MATH 142, 151)', [
    new AndRequirement([
      new CourseRequirement('MATH 142'),
      new CourseRequirement('MATH 151'),
    ]),
  ]);
});

test('parse 4', async () => {
  await tryParse(
    'AIML 131 or 60 200-level points or at least a B in DATA 101',
    [
      new AnyRequirement([
        new CourseRequirement('AIML 131'),
        new PointRequirement(200, 60),
        new CourseRequirement('DATA 101'),
      ]),
    ]
  );
});

test('parse 5', async () => {
  await tryParse('the pair (MATH 142, 151)', [
    new AndRequirement([
      new CourseRequirement('MATH 142'),
      new CourseRequirement('MATH 151'),
    ]),
  ]);
});

test('parse 6', async () => {
  await tryParse('EEEN 313, one of (ENGR 222, MATH 244)', [
    new AndRequirement([
      new CourseRequirement('EEEN 313'),
      new AnyRequirement([
        new CourseRequirement('ENGR 222'),
        new CourseRequirement('MATH 244'),
      ]),
    ]),
  ]);
});

test('parse 7', async () => {
  await tryParse(
    'ENGR 123 or (MATH 161, one of MATH 177, QUAN 102 or STAT 193)',
    [
      new AnyRequirement([
        new CourseRequirement('ENGR 123'),
        new AndRequirement([
          new CourseRequirement('MATH 161'),
          new AnyRequirement([
            new CourseRequirement('MATH 177'),
            new CourseRequirement('QUAN 102'),
            new CourseRequirement('STAT 193'),
          ]),
        ]),
      ]),
    ]
  );
});

test('parse 8', async () => {
  await tryParse('one of (COMP 309, EEEN 325 (or ECEN 301)', [
    new AnyRequirement([
      new CourseRequirement('COMP 309'),
      new CourseRequirement('EEEN 325'),
      new CourseRequirement('ECEN 301'),
    ]),
  ]);
});

test('parse 9', async () => {
  await tryParse('Any pair (MATH 141/QUAN 111, MATH 151/161/177)', [
    new AnyRequirement([
      new AndRequirement([
        new CourseRequirement('MATH 141'),
        new AnyRequirement([
          new CourseRequirement('QUAN 111'),
          new CourseRequirement('MATH 151'),
          new CourseRequirement('MATH 161'),
          new CourseRequirement('MATH 177'),
        ]),
      ]),
      new AndRequirement([
        new CourseRequirement('QUAN 111'),
        new AnyRequirement([
          new CourseRequirement('MATH 141'),
          new CourseRequirement('MATH 151'),
          new CourseRequirement('MATH 161'),
          new CourseRequirement('MATH 177'),
        ]),
      ]),
      new AndRequirement([
        new CourseRequirement('MATH 151'),
        new AnyRequirement([
          new CourseRequirement('MATH 141'),
          new CourseRequirement('QUAN 111'),
          new CourseRequirement('MATH 161'),
          new CourseRequirement('MATH 177'),
        ]),
      ]),
      new AndRequirement([
        new CourseRequirement('MATH 161'),
        new AnyRequirement([
          new CourseRequirement('MATH 141'),
          new CourseRequirement('QUAN 111'),
          new CourseRequirement('MATH 151'),
          new CourseRequirement('MATH 177'),
        ]),
      ]),
      new AndRequirement([
        new CourseRequirement('MATH 177'),
        new AnyRequirement([
          new CourseRequirement('MATH 141'),
          new CourseRequirement('QUAN 111'),
          new CourseRequirement('MATH 151'),
          new CourseRequirement('MATH 161'),
        ]),
      ]),
    ]),
  ]);
});

test('set course prerequisites', () => {
  const test1 = getMockCourse('SWEN 325', '(P) NWEN 243, SWEN 225 (or 222)');
  const test2 = getMockCourse('SWEN 325', '(P) NWEN 243 (X) SWEN 225');

  const courses: Course[] = [
    getMockCourse('SWEN 225', ''),
    getMockCourse('SWEN 222', ''),
    getMockCourse('NWEN 243', ''),
    test1,
    test2,
  ];

  RequirementService.setCoursePrerequisites(courses);

  expect(test1.prerequisites).toEqual(['NWEN 243', 'SWEN 225', 'SWEN 222']);
  expect(test2.prerequisites).toEqual(['NWEN 243']);
});

test('set course status', () => {
  const test1 = getMockCourse('NWEN 243', '');
  const test2 = getMockCourse('SWEN 325', '(P) NWEN 243, SWEN 225 (or 222)');
  const test3 = getMockCourse('SWEN 325', '(P) NWEN 243 (X) SWEN 225');

  const courses: Course[] = [
    getMockCourse('SWEN 225', ''),
    getMockCourse('SWEN 222', ''),
    test1,
    test2,
    test3,
  ];

  const selected = [test1.id];

  RequirementService.setCourseStatus(courses, selected);

  expect(test1.status).toEqual(CourseStatus.Selected);
  expect(test2.status).toEqual(CourseStatus.Ineligible);
  expect(test3.status).toEqual(CourseStatus.Eligible);
});

async function tryFormat(requirements: string, expectedResult: string) {
  const courses = await getCourses();
  RequirementService.setSubjects(courses);

  const result = RequirementService.formatRequirement(requirements);
  expect(result).toEqual(expectedResult);
}

async function tryParse(requirements: string, expectedResult: Requirement[]) {
  const courses = await getCourses();
  RequirementService.setSubjects(courses);

  const result = RequirementService.parseRequirementsSection(requirements);
  expect(result).toEqual(expectedResult);
}
