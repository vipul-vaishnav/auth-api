import express from 'express'
import {
  createUser,
  loginUser,
  getUser,
  updateUserPassword,
  refresh,
  logoutUser
} from '../controllers/userController.js'
import verifyToken from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/new', createUser)
router.post('/login', loginUser)
router.route('/me').get(verifyToken, getUser)
router.get('/refresh', refresh, verifyToken, getUser)
router.post('/logout', logoutUser)
router.route('/change-password').post(verifyToken, updateUserPassword)

export default router
