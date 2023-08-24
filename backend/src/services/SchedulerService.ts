import cron, { ScheduledTask } from 'node-cron';
import UpdateService from './UpdateService';

const updateInterval = '0 0 1 * *'; // 12:00am on the 1st

class SchedulerService {
  task: ScheduledTask | undefined;
  async init() {
    if (UpdateService.shouldUpdate()) {
      console.log('Fetching course data before scheduling');
      await UpdateService.update();
    }

    this.task = cron.schedule(updateInterval, async () => {
      await UpdateService.update();
    });
    console.log('UpdateService scheduled with', updateInterval);
  }
}

export default new SchedulerService();
