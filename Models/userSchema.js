// import mongoose in userSchema.js file
const mongoose = require('mongoose')

// using mongoose , define schema for users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    acno: {
        type: Number,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true
    },
    transactions: {
        type: Array,
        required: true
    }
})

// create a model/collection to store documents as given schema
const users = mongoose.model('users', userSchema)

// export model
module.exports = users