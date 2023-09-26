import { Router } from 'express';
import DatastoreService from '../services/DatastoreService';
import CourseQueryService from '../services/CourseQueryService';
import GraphingService from '../services/GraphingService';
import RequirementService from '../services/RequirementService';

const router = Router();

router.get('/pathway', async (req, res) => {
  try {
    const courseParam = req.query.completedCourses as string | undefined;
    const completedCourses = courseParam && JSON.parse(courseParam);

    const allCourses = DatastoreService.getCourses();

    if (completedCourses) {
      RequirementService.setCourseStatus(allCourses, completedCourses);
    }

    const graph = completedCourses
      ? GraphingService.getNodesAndEdges(
          new CourseQueryService(allCourses).getCoursesPathway(completedCourses)
        )
      : GraphingService.getNodesAndEdges(allCourses);

    res.json(graph);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default router;
