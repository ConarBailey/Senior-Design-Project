const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ 'message': 'Username, password and email are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            "username": username,
            "password": hashedPwd,
            "email": email,
            "calorieGoal": req.body.calorieGoal,
            "mealName": req.body.mealName,
            "logDate": req.body.logDate,
            "modComments": req.body.modComments,
            "foodName": req.body.foodName,
            "quantityUnits": req.body.quantityUnits,
            "quantityValue": req.body.quantityValue,
            "calories": req.body.calories
    });
        
        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };