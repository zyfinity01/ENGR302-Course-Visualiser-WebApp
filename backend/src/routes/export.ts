import { Router } from 'express'
import StorageService from '../services/storageService'

const router = Router()

router.get('/csv', (req, res) => {
  const csv = StorageService.getCSV()

  res.setHeader('Content-Type', 'text/csv')
  res.status(200).send(csv)
})

export default router
