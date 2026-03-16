const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);


    // creationDate: {
    //     type: Date,
    //     default: Date.now
    // },    
    // calorieGoal: {
    //     type: String,
    // },        
    // logDate: {
    //     type: Date
    // },
    // mealName: {
    //     type: String
    // },
    // foodName: {
    //     type: String
    // },
    // quantityValue: {
    //     type: Number
    // },
    // quantityUnits: {
    //     type: Number
    // },
    // calories: {
    //     type: Number
    // },

