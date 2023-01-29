import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connect from './configs/connectDb.js'
import UserRouter from './routes/userRoutes.js'
import errorHandler from './middlewares/errorMiddleware.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const PORT = process.env.PORT || 5000
const DB_URI = process.env.MONGO_DB_URI.replace('%USER%', process.env.MONGO_DB_USER).replace(
  '%PASSWORD%',
  process.env.MONGO_DB_PASSWORD
)

// connectin to DB
await connect(DB_URI)

const app = express()
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Welcome to API' })
})

app.use('/api/v1/users', UserRouter)

app.use(errorHandler)

app.listen(PORT, function () {
  console.log(colors.bold.magenta.underline('Server listening on port', PORT))
})
