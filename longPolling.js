const url = require('url')
const fs = require('fs')
const utf8 = require('utf8')

let messages = ['testing']
let clients = []

function longPolling (req, res) {
  // parse url
  let urlParts = url.parse(req.url)
  console.log(urlParts)
  // get pathname from url, this is the home page path
  if (urlParts.pathname === '/') {
    /// read file
    fs.readFile('index.html', (err, data) => {
      if (err) throw err
      res.end(data)
    })
  } else if (urlParts.pathname.substring(0, 5) === '/poll') {
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
    // computes a new string in which hexadecimal escape sequences are replaced with the character that it represents
    let msg = unescape(urlParts.pathname.substr(5))
    messages.push(msg)
    while (clients.length > 0) {
      let client = clients.pop()
      client.end(JSON.stringify({
        count: messages.length,
        // important to decode it to utf8 (ékezetes karakterek!)
        append: utf8.decode(msg) + '\n'
      }))
    }
    // end response
    res.end()
  }
}

module.exports = longPolling
