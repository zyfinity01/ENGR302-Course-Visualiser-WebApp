import { handleExport } from '../services/GraphExportService'
import { toPng } from 'html-to-image'

// Mocking the toPng function
jest.mock('html-to-image', () => ({
  toPng: jest.fn(),
}))

describe('handleExport', () => {
  let mockElement: any
  let linkMock: any

  beforeEach(() => {
    // Mocking document.querySelector
    mockElement = { someProperty: 'element' }
    document.querySelector = jest.fn().mockReturnValue(mockElement)

    // Mocking document.createElement for 'a' tag
    linkMock = {
      download: '',
      href: '',
      click: jest.fn(),
    }
    document.createElement = jest.fn().mockReturnValue(linkMock)

    // Mocking console.error
    console.error = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle export successfully', async () => {
    // Mock successful toPng response
    ;(toPng as jest.Mock).mockResolvedValueOnce('dataUrlSample')

    await handleExport()

    expect(document.querySelector).toHaveBeenCalledWith('.react-flow__viewport')
    expect(toPng).toHaveBeenCalledWith(mockElement, { pixelRatio: 6 })
    expect(linkMock.download).toBe('graph.png')
    expect(linkMock.href).toBe('dataUrlSample')
    expect(linkMock.click).toHaveBeenCalled()
  })

  it('should log error if export fails', (done) => {
    // Mock failed toPng response
    ;(toPng as jest.Mock).mockRejectedValueOnce(new Error('Export Error'))

    handleExport()

    // Use setTimeout to wait for the promise chain to complete
    setTimeout(() => {
      expect(document.querySelector).toHaveBeenCalledWith(
        '.react-flow__viewport'
      )
      expect(toPng).toHaveBeenCalledWith(mockElement, { pixelRatio: 6 })
      expect(console.error).toHaveBeenCalledWith(
        'Export failed:',
        new Error('Export Error')
      )
      done()
    }, 0)
  })
})
