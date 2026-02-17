import express from 'express'
import cors from 'cors'
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)

app.use(express.json())

export { app }
