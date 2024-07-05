const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://kishaldb:kishal12345@cluster0.79djiea.mongodb.net/mern-rooms';

mongoose.connect(mongoURL, {})
    .then(() => {
        console.log('Mongo DB connection Successful');
    })
    .catch((error) => {
        console.log('Mongo DB connection error:', error);
    });

module.exports = mongoose;
