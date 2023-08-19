import { Router } from 'express'
import AuthService from '../services/authService'
import StorageService from '../services/storageService'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post(
  '/json',
  AuthService.AUTH_MIDDLEWARE,
  /*AuthService.WRITE_COURSE_SCOPE */ upload.single('file'),
  (req, res) => {
    // The file will be stored in req.file
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    // Get JSON from uploaded file
    const json = req.file.buffer.toString('utf-8')

    // Save to disk using the static path ./data/courses.json
    StorageService.saveJSON(json)

    // Send success response
    res.status(200).send('JSON uploaded and saved.')
  }
)

export default router
