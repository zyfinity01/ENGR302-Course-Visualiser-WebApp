import CatprintService from '../src/services/CatprintService';

test('get all courses', async () => {
  const courses = await CatprintService.getCourses();
  expect(courses.length).toBeGreaterThan(0);
});
