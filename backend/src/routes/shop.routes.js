import express from 'express'
import { verifyToken } from '../middleware/auth.middle.js'
import { getMyItems, addItem, updatePrice, deleteItem, toggleAvailability } from '../controllers/shop.controller.js'

const router = express.Router()

router.get('/my-items', verifyToken, getMyItems)
router.post('/add-item', verifyToken, addItem)
router.put('/update-price', verifyToken, updatePrice)
router.delete('/delete-item', verifyToken, deleteItem)
router.put('/toggle-availability', verifyToken, toggleAvailability)

export { router as updateShop }
