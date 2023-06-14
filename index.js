// import dotenv
// Loads .env file contents into process.env.
require('dotenv').config();
// import express
const express = require('express')
// import cors
const cors = require('cors')

// import db
require('./db/connection.js')

// import router
const router = require('./Routes/router.js')
// import middleware
const middleware = require('./Middleware/appMiddleware.js')

// Create express server
const server = express()

// Setup port number for server
const PORT = 3000 || process.env.PORT

// use cors,json parser in server app
server.use(cors())
server.use(express.json())
// use appmiddleware
server.use(middleware.appMiddleware)

// use router in server app after using json parser
server.use(router)


// to resolve http request using express server
server.get('/', (req, res) => {
    res.send('<h1>Bank Server Started....</h1>')
})



// run the server app in specified port
server.listen(PORT, () => {
    console.log(`Bank Server Started at port number ${PORT}`);
})
