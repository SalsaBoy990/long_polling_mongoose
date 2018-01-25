const url = require('url')
const fs = require('fs')

// Used for setting the right char encoding for the messages
const utf8 = require('utf8')

// HTML escape to replace <, >, &, ', "
const escapeHtml = require('escape-html')

// Load our MongoDB Model
const MsgModel = require('./mongoose')

// Our array to store the msgs, and also to store the msgs read from the database
let messages = []
console.log(messages)

// To temporarly store the response object (pending responses)
let clients = []

// Push the msgs from the database to the messages array
MsgModel.find({}, function (err, data) {
  if (err) throw err

  for (let i = 0; i < data.length; i++) {
    messages.push(data[i].message.toString('utf8'))
    console.log(data[i].message.toString('utf8'))
  }
})

// Callback function that handles long polling
function longPolling (req, res) {
  // Parse url
  let urlParts = url.parse(req.url)
  console.log(urlParts)

  // Get pathname from url, this is the homepage
  if (urlParts.pathname === '/') {
    // Read the HTML file
    fs.readFile('index.html', (err, data) => {
      if (err) throw err
      res.end(data)
    })
  } else if (urlParts.pathname.substring(0, 5) === '/poll') {
    //
    // remove all non-numeric characters
    let count = urlParts.pathname.replace(/[^0-9]*/, '')
    console.log(count)

    // if there are more messages in the array
    if (messages.length > count) {
      // send the new messages to the client
      res.end(JSON.stringify({
        count: messages.length,
        append: messages.slice(count).join('\n') + '\n'
      }))
    } else {
      // if there are no new messages, save the response object (request is pending)
      clients.push(res)
    }
  } else if (urlParts.pathname.substr(0, 5) === '/msg/') {
    /* Computes a new string in which hexadecimal escape sequences
    are replaced with the character that it represents; HTML escaped */
    let msg = escapeHtml(unescape(urlParts.pathname.substr(5)))

    // Very important to decode it to utf8!!!
    msg = utf8.decode(msg)
    console.log(msg)

    // The right format to insert into database
    let toDatabase = {
      message: msg
    }
    // Insert the new message into the Mongo database
    new MsgModel(toDatabase).save((err) => {
      if (err) {
        console.error('Database insertion error.')
        throw err
      }
    })
    // Push the new message to the messages array too
    messages.push(msg)
    while (clients.length > 0) {
      let client = clients.pop()
      client.end(JSON.stringify({
        count: messages.length,
        append: msg + '\n'
      }))
    }
    // End response
    res.end()
  }
}

// Export
module.exports = longPolling
