import { Router } from 'express'
import StorageService from '../services/storageService'

const router = Router()

router.get('/json', (req, res) => {
  const json = StorageService.getJSON()

  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(json)
})

export default router
