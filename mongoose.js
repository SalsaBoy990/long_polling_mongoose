const mongoose = require('mongoose')
// To generate guid identifiers
const uuidv4 = require('uuid/v4')

// Connect to database
mongoose.connect('mongodb://localhost/longpoll')

// Create a schema to store messages
let MsgSchema = mongoose.Schema({

  // unique id
  guid: { type: String, default: uuidv4() },

  // current date
  datetime: { type: Date, default: new Date() },

  // the message
  message: { type: String, required: true }

}, { collection: 'msgs' })

// Create the model
let MsgModel = mongoose.model('MsgModel', MsgSchema)

// Export the model
module.exports = MsgModel
