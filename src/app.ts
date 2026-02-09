import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).send({
    host: req.host,
    method: req.method,
    status: 'healthy',
    code: 200
  })
})

const port = process.env.PORT || 3001

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log('server listens on http://localhost:' + port)
    })
  } catch (error) {
    console.log(error)
    throw new Error('server not started')
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export { startServer }
