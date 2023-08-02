import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'

import importRoutes from './routes/import'
import exportRoutes from './routes/export'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

app.use(cors())
app.options('*', cors())

app.use('/api/import', importRoutes)
app.use('/api/export', exportRoutes)

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`)
})
