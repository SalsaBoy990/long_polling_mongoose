# long_polling_mongoose
Simple messaging Node.js application that uses long polling with MongoDB connection (mongoosejs) over HTTP

## Install MongoDB on your computer

*[Download the installer](https://www.mongodb.org/dl/win32/x86_64-2008plus-ssl). I use this version: 

mongodb-win32-x86_64-2008plus-ssl-3.2.9-signed.msi
* Install it in a folder like this: `C:\mongodb`
* Create the following folders inside `C:\mongodb`: `data/db` and `log`
* Add `C:\mongodb\bin` to the PATH variable if needed, or go to the directory and 

run this command:

`mongod --directoryperdb --dbpath C:\mongodb\data\db --logpath C:\mongodb\log\mongo.log --logappend --install`

* Run the service: `net start MongoDB`
* Run the shell application: `mongo`


## Setup our Node application in a folder


Create a package.json: `npm init`


Download required packages (save them locally):

* `npm i mongoose --save`
* etc.

Start the server: `node server`

In your browser navigate to `http://localhost:8080`
In a new browser window or tab navigate to `http://localhost:8080/msg/`, and `http://localhost:8080/msg/Add+your+message+here`

## The messages are stored in the Mongo database, and queried from it

* Start `mongo`
* `show dbs`
* `use longpoll`
* `show collections`
* `db.msgs.find().pretty()`

### Contact

András Gulácsi
guland@protonmail.com



