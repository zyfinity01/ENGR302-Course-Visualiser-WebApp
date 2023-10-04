import CourseAPI from '../services/CourseAPI'

// Create a mock function for fetch
const mockFetch = jest.fn()

// Mock the global fetch function
global.fetch = mockFetch

describe('CourseAPI', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getPathwayData', () => {
    it('should fetch pathway data without completedCourses', async () => {
      // Mock successful fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'sampleData' }),
      })

      const result = await CourseAPI.getPathwayData()

      const fetchArgs = mockFetch.mock.calls[0]
      console.log('Received:', fetchArgs[0])
      console.log('Expected:', 'http://localhost:8080/api/courses/pathway')
      expect(String(fetchArgs[0])).toEqual(
        String('http://localhost:8080/api/courses/pathway')
      )

      expect(fetchArgs[1]).toEqual({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual({ data: 'sampleData' })
    })

    it('should fetch pathway data with completedCourses', async () => {
      // Mock successful fetch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'sampleDataWithCourses' }),
      })

      const result = await CourseAPI.getPathwayData(['ENGR 302'])

      const fetchArgs = mockFetch.mock.calls[0]
      console.log('Received:', fetchArgs[0])
      console.log(
        'Expected:',
        'http://localhost:8080/api/courses/pathway?completedCourses=%5B%22ENGR+302%22%5D'
      )
      expect(String(fetchArgs[0])).toEqual(
        String(
          'http://localhost:8080/api/courses/pathway?completedCourses=%5B%22ENGR+302%22%5D'
        )
      )

      expect(fetchArgs[1]).toEqual({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual({ data: 'sampleDataWithCourses' })
    })

    it('should throw an error when the response is not ok', async () => {
      // Mock failed fetch response
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      await expect(CourseAPI.getPathwayData()).rejects.toThrow(
        'Network response was not ok'
      )
    })

    it('should throw an error on network failure', async () => {
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network Error'))

      await expect(CourseAPI.getPathwayData()).rejects.toThrow('Network Error')
    })
  })
})
