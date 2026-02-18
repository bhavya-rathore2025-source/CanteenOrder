import { getFood } from '../controllers/getFood.controller.js'
import express from 'express'

const router = express.Router()

router.get('/food', getFood)

export { router as GetFood }
