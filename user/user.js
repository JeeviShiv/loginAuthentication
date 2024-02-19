const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    emailId: String,
    password: String,
    role: { type: String, default:'customer'}
});
mongoose.model('user',UserSchema);

module.exports = mongoose.model('user');