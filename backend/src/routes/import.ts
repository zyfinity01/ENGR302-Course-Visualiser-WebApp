import { Router } from 'express'
import AuthService from '../services/authService'
import StorageService from '../services/storageService'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post(
  '/csv',
  AuthService.AUTH_MIDDLEWARE,
  /*AuthService.WRITE_COURSE_SCOPE */ upload.single('file'),
  (req, res) => {
    // The file will be stored in req.file
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    // Get CSV from uploaded file
    const csv = req.file.buffer.toString('utf-8')

    // Save to disk using the static path ./data/courses.csv
    StorageService.saveCSV(csv)

    // Send success response
    res.status(200).send('CSV uploaded and saved.')
  }
)

export default router
