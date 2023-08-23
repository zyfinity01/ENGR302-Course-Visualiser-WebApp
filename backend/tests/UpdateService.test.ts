import { getMockCourse } from './util';

import UpdateService from '../src/services/UpdateService';
import CatprintService from '../src/services/CatprintService';
import Datastore from '../src/services/DatastoreService';
import RequirementService from '../src/services/RequirementService';

jest.mock('../src/services/CatprintService');
jest.mock('../src/services/DatastoreService');
jest.mock('../src/services/RequirementService');

describe('UpdateService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch courses, set prerequisites and save to datastore', async () => {
    // Mock data
    const mockCourses = [
      getMockCourse('SWEN 225', ''),
      getMockCourse('SWEN 222', ''),
      getMockCourse('NWEN 243', ''),
    ];

    // Mock implementations
    (CatprintService.getCourses as jest.Mock).mockResolvedValue(mockCourses);
    (RequirementService.setCoursePrerequisites as jest.Mock).mockImplementation(
      () => {}
    );
    (Datastore.saveCourses as jest.Mock).mockImplementation(() => {});

    await UpdateService.update();

    expect(CatprintService.getCourses).toHaveBeenCalled();
    expect(RequirementService.setCoursePrerequisites).toHaveBeenCalledWith(
      mockCourses
    );
    expect(Datastore.saveCourses).toHaveBeenCalledWith(mockCourses);
  });

  it('should throw an error if Catprint fails to return courses', async () => {
    (CatprintService.getCourses as jest.Mock).mockResolvedValue(null);
    await expect(UpdateService.update()).rejects.toThrow(
      'Catprint failed to return courses'
    );
  });

  it('should return true if there is no data in the Datastore', () => {
    (Datastore.hasData as jest.Mock).mockReturnValue(false);

    expect(UpdateService.shouldUpdate()).toBe(true);
  });

  it('should return false if there is data in the Datastore', () => {
    (Datastore.hasData as jest.Mock).mockReturnValue(true);

    expect(UpdateService.shouldUpdate()).toBe(false);
  });
});
