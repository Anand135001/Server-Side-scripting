const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/authApp");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
})
module.exports = mongoose.model("User", userSchema);
