import UserModel from './../models/User.js'
import bcrypt from 'bcrypt'
import generateToken from '../token/generateToken.js'
import asyncHandler from 'express-async-handler'

// @desc    To register a new user
// @route   /api/v1/users/new
// @access  PUBLIC
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  try {
    if (name && email && password) {
      const doesUserExist = await UserModel.findOne({ email })

      if (doesUserExist) {
        res.status(400)
        throw new Error('User with email already exists')
      } else {
        if (!name || name.trim().length < 4) {
          res.status(400)
          throw new Error('Invalid name, name should be at least 4 characters')
        } else {
          const salt = await bcrypt.genSalt(12)
          const hashedPassword = await bcrypt.hash(password, salt)

          const USER_DATA = {
            name,
            email,
            password: hashedPassword
          }

          const userEntry = await UserModel.create(USER_DATA)

          if (userEntry) {
            res.status(201).json({
              status: 'success',
              message: 'User created successfully!',
              data: {
                user: { id: userEntry.id, ...USER_DATA, password: undefined }
              }
            })
          } else {
            res.status(400)
            throw new Error('Invalid user data')
          }
        }
      }
    } else {
      res.status(404)
      throw new Error('Missing required field/s')
    }
  } catch (error) {
    res.status(404)
    throw new Error(error.message)
  }
})

// @desc    To login an existing user
// @route   /api/v1/users/login
// @access  PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  try {
    if (email && password) {
      const doesUserExist = await UserModel.findOne({ email })

      if (doesUserExist) {
        const isPasswordCorrect = await bcrypt.compare(password, doesUserExist.password)

        if (isPasswordCorrect) {
          const token = generateToken(doesUserExist._id)

          res.cookie(String(doesUserExist._id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
          })

          res.status(200).json({
            status: 'success',
            message: 'User verified successfully!',
            data: {
              user: { id: doesUserExist._id, name: doesUserExist.name, email: doesUserExist.email }
            },
            token
          })
        } else {
          res.status(400)
          throw new Error('Invalid email or password')
        }
      } else {
        res.status(400)
        throw new Error('User with this email not found')
      }
    } else {
      res.status(404)
      throw new Error('Missing required field/s')
    }
  } catch (error) {
    res.status(401)
    throw new Error(error.message)
  }
})

// @desc    To get data of an existing user
// @route   /api/v1/users/me
// @access  PRIVATE
const getUser = asyncHandler(async (req, res) => {
  const { user } = req
  res.status(200).json({
    status: 'success',
    message: 'User found successfully!',
    data: {
      user: { id: user._id, name: user.name, email: user.email }
    }
  })
})

// @desc    To reset password of an existing user
// @route   /api/v1/users/change-password
// @access  PRIVATE
const updateUserPassword = asyncHandler(async (req, res) => {
  const { user } = req
  const { currentPassword, newPassword } = req.body

  try {
    if (currentPassword && newPassword) {
      if (newPassword.trim().length < 8) {
        res.status(404)
        throw new Error('Password too short, must be at least 8 characters')
      } else {
        const existingUser = await UserModel.findById(user._id)
        const verifyCurrentPassword = await bcrypt.compare(currentPassword, existingUser.password)

        if (verifyCurrentPassword) {
          const salt = await bcrypt.genSalt(12)
          const hashedPassword = await bcrypt.hash(newPassword, salt)
          await UserModel.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } })
          res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
          })
        } else {
          res.status(400)
          throw new Error('Incorrect current password')
        }
      }
    } else {
      res.status(404)
      throw new Error('Missing required field/s')
    }
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

export { createUser, loginUser, getUser, updateUserPassword }
