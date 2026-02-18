import { registerUser } from '../controllers/register.controller.js'
import express from 'express'

const router = express.Router()

router.post('/register', registerUser)

export { router as RegisterPage }
