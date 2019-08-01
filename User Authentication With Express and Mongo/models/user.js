const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    password: {
        type: String, 
        required: true
    }
});

//  Hash password before saving to the database
UserSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

let User = mongoose.model( 'User', UserSchema );
module.exports = User;