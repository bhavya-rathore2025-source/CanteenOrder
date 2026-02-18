import { verifyUser } from '../controllers/verify.controller.js'
import express from 'express'

const router = express.Router()

router.post('/verify', verifyUser)

export { router as verifypage }
