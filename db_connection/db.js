require('dotenv').config()
const mongoose = require('mongoose');
const mongodb = process.env.mongodb_url;

mongoose.connect(`${mongodb}`, {

    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    // useCreateIndex: true

}).then(() => {
    console.log("connection successfully..")
}).catch((e) => {
    console.log("database connection error is : " + e);
})

