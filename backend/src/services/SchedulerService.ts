import cron, { ScheduledTask } from 'node-cron';
import Datastore from './DatastoreService';
import UpdateService from './UpdateService';

/**
 * Time between data updates, expressed in minutes.
 * This represents the default of 30 days.
 */
const updateIntervalMins =
  Number(process.env.UPDATE_INTERVAL_MINS) || 60 * 24 * 30;

/**
 * Time between data updates, expressed as a cron string.
 * Updates are scheduled for 12:00am on the 1st of every month by default.
 */
const updateInterval = '0 0 1 * *';

class SchedulerService {
  task: ScheduledTask | undefined;

  /**
   * Initialises the Scheduler, updating the Datastore if necessary.
   */
  async init() {
    if (this.shouldUpdate()) {
      console.log('Fetching course data before scheduling');
      await UpdateService.update();
    }

    this.task = cron.schedule(updateInterval, async () => {
      await UpdateService.update();
    });
    console.log('UpdateService scheduled with', updateInterval);
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

export default new SchedulerService();
