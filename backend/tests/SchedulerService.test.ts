import Datastore from '../src/services/DatastoreService';
import SchedulerService from '../src/services/SchedulerService';

jest.mock('../src/services/DatastoreService');

describe('UpdateService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return true if there is no data in the Datastore', () => {
    (Datastore.hasData as jest.Mock).mockReturnValue(false);

    expect(SchedulerService.shouldUpdate()).toBe(true);
  });

  it('should return true if the last updated time exceeds the interval', () => {
    (Datastore.hasData as jest.Mock).mockReturnValue(true);
    const pastDate: number = Date.now() - 60 * 60 * 24 * 31 * 1000; // Set it to 31 days ago, just past the interval
    (Datastore.getLastUpdatedTime as jest.Mock).mockReturnValue(pastDate);

    expect(SchedulerService.shouldUpdate()).toBe(true);
  });

  it('should return false if the data is present and within the update interval', () => {
    (Datastore.hasData as jest.Mock).mockReturnValue(true);
    const recentDate: number = Date.now() - 60 * 24 * 15 * 1000; // Set it to 15 days ago, within the interval
    (Datastore.getLastUpdatedTime as jest.Mock).mockReturnValue(recentDate);

    expect(SchedulerService.shouldUpdate()).toBe(false);
  });
});
