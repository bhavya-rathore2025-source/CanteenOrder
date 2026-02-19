import express from 'express'
import { verifyToken } from '../middleware/auth.middle.js'
import { placeOrder } from '../controllers/order.controller.js'
import { getShopOrders, updateOrderStatus } from '../controllers/order.controller.js'

const router = express.Router()
router.put('/update-order-status', verifyToken, updateOrderStatus)
router.post('/place-order', verifyToken, placeOrder)
router.get('/shop-orders', verifyToken, getShopOrders)

export { router as orderRoute }
