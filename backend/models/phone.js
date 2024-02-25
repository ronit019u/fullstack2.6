const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connectting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to Mongodb')
})
.catch(error => {
    console.log('error connecting to mongodb43', error.message)
})

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)