const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },    
    email: {
        type: String,
        required: true,
    },    
    creationDate: {
        type: Date,
        default: Date.now
    },    
    calorieGoal: {
        type: String,
    },        
    role: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    modComments: {
        type: String,
    },
    refreshToken: String
})

module.exports = mongoose.model('User',userSchema);