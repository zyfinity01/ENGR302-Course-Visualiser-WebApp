import CatprintService from './CatprintService';
import Datastore from './DatastoreService';
import RequirementService from './RequirementService';

class UpdateService {
  /**
   * Fetch for courses and update the datastore
   */
  async update() {
    const courses = await CatprintService.getCourses();
    if (!courses) {
      throw new Error('Catprint failed to return courses');
    }

    RequirementService.setCoursePrerequisites(courses);
    Datastore.saveCourses(courses);
  }

  /**
   * See if update should occur because the data does not exist.
   * @returns true if the data should be updated, else false.
   */
  shouldUpdate(): boolean {
    return !Datastore.hasData();
  }
}

export default new UpdateService();
