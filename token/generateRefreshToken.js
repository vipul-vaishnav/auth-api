import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY

const generateToken = (id) => {
  const token = jwt.sign({ userId: id }, JWT_REFRESH_KEY, { expiresIn: '35s' })
  return token
}

export default generateToken
