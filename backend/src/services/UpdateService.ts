import CatprintService from './CatprintService';
import Datastore from './DatastoreService';
import RequirementService from './RequirementService';

/**
 * Time between data updates, defaults to 30 days.
 */
const updateIntervalMins =
  Number(process.env.UPDATE_INTERVAL_MINS) || 60 * 24 * 30;

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
   * See if update should occur, either because of
   * the data does not exist, or it is too old.
   *
   * @returns true if the data should be updated, else false.
   */
  shouldUpdate(): boolean {
    if (!Datastore.hasData()) {
      return true;
    }

    const differenceMins =
      (Date.now() - Datastore.getLastUpdatedTime()) / 1000 / 60;
    return differenceMins > updateIntervalMins;
  }
}

export default new UpdateService();
