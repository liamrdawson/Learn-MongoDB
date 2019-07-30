let mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true,
        required: true, 
        trim: true
    },
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    favouriteBook: {
        type: String, 
        required: true, 
        trim: true
    },
    favouriteBook: {
        type: String, 
        required: true, 
    }
});

let User = mongoose.model( 'User', UserSchema );
module.exports = User;