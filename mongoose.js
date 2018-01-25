const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

// Connect to database
mongoose.connect('mongodb://localhost/longpoll')

// Create a schema to store messages
let MsgSchema = mongoose.Schema({
  guid: { type: String, default: uuidv4() },
  datetime: { type: Date, default: new Date() },
  message: { type: String, required: true }
}, { collection: 'msgs' })

// Create the model
let MsgModel = mongoose.model('MsgModel', MsgSchema)

module.exports = MsgModel
