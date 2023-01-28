import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connect from './configs/connectDb.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const DB_URI = process.env.MONGO_DB_URI.replace('%USER%', process.env.MONGO_DB_USER).replace(
  '%PASSWORD%',
  process.env.MONGO_DB_PASSWORD
)

// connectin to DB
await connect(DB_URI)

const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.use('/', (req, res, next) => {
  res.send('welcome to the api!')
})

app.listen(PORT, function () {
  console.log(colors.bold.magenta.underline('Server listening on port', PORT))
})
