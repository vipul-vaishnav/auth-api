import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const generateToken = (id) => {
  const token = jwt.sign({ userId: id }, JWT_SECRET_KEY, { expiresIn: '30s' })
  return token
}

export default generateToken
