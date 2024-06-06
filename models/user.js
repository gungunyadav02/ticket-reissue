const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/ticketproject");

const userSchema = mongoose.Schema({
    Query: String,
})

module.exports = mongoose.model('user', userSchema);