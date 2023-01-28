import express from 'express'
import { createUser, loginUser, getUser, updateUserPassword } from '../controllers/userController.js'
import verifyToken from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/new', createUser)
router.post('/login', loginUser)
router.route('/me').get(verifyToken, getUser)
router.route('/change-password').post(verifyToken, updateUserPassword)

export default router
