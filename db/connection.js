// define node app and mogodb database connectivity

// import mongoose
const mongoose = require('mongoose')

// to get connection string from .env file : process.env
const connectionString = process.env.DATABASE

// connect node app with mongodb using connection string with help of mongoose  
mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log('MongoDB Atlas Connected Successfully');
}).catch((error)=>{
    console.log('MongoDB Connection Error: '+error);
})
