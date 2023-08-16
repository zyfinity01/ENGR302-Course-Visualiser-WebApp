import fs from 'fs'
import path from 'path'

const storageService = {
  SAVE_PATH: './data/',
  JSON_NAME: 'courses.json',
  saveJSON: (json: string) => {
    const filePath = path.join(
      storageService.SAVE_PATH,
      storageService.JSON_NAME
    )

    // Create the directory if it doesn't exist
    if (!fs.existsSync(storageService.SAVE_PATH)) {
      fs.mkdirSync(storageService.SAVE_PATH, { recursive: true })
    }

    // Write the JSON to the file, overwriting if it exists
    fs.writeFileSync(filePath, json)
  },
  getJSON: () => {
    const filePath = path.join(
      storageService.SAVE_PATH,
      storageService.JSON_NAME
    )
    return fs.readFileSync(filePath, 'utf-8')
  },
}

export default storageService
