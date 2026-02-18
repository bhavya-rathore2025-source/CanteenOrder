import express from 'express'
import cors from 'cors'
import { LoginPage } from './routes/login.routes.js'
import { RegisterPage } from './routes/register.routes.js'
import { GetFood } from './routes/getFood.routes.js'
import cookieParser from 'cookie-parser'
import { verifypage } from './routes/verify.routes.js'
const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use('/app', LoginPage)
app.use('/app', RegisterPage)
app.use('/app', GetFood)
app.use('/app', verifypage)

export { app }
