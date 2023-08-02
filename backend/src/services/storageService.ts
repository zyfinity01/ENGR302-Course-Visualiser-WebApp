import fs from 'fs'
import path from 'path'

const storageService = {
  SAVE_PATH: './data/',
  CSV_NAME: 'courses.csv',
  saveCSV: (csv: string) => {
    const filePath = path.join(
      storageService.SAVE_PATH,
      storageService.CSV_NAME
    )

    // Create the directory if it doesn't exist
    if (!fs.existsSync(storageService.SAVE_PATH)) {
      fs.mkdirSync(storageService.SAVE_PATH, { recursive: true })
    }

    // Write the CSV to the file, overwriting if it exists
    fs.writeFileSync(filePath, csv)
  },
  getCSV: () => {
    const filePath = path.join(
      storageService.SAVE_PATH,
      storageService.CSV_NAME
    )
    return fs.readFileSync(filePath, 'utf-8')
  },
}

export default storageService
