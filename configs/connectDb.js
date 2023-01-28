import mongoose from 'mongoose'
import colors from 'colors'

const options = {}

const connect = async (DB_URI) => {
  try {
    mongoose.set('strictQuery', false)
    const res = await mongoose.connect(DB_URI)
    console.log(colors.yellow.bold(res.connection.host, '=> Connection established!'))
  } catch (error) {
    console.log(colors.bold.red('Error connecting to MongoDB'))
    process.exit(1)
  }
}

export default connect
