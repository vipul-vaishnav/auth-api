import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import userModel from './../models/User.js'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const verifyToken = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //get token from authorization
      token = req.headers.authorization.split(' ')[1]

      // get id from token
      const { userId } = jwt.verify(token, JWT_SECRET_KEY)

      // get user from id
      req.user = await userModel.findById(userId).select('-password')

      // calling next middleware
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized')
  }
})

export default verifyToken
