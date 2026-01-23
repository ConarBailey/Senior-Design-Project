const Userfoodlog = require('../model/Userfoodlog');

const handleNewFoodLog = async (req, res) => {
    const { username, foodName, quantityValue, quantityUnits, calories} = req.body;
    if (!username || !foodName || !quantityValue || !quantityUnits || !calories) return res.status(400).json({ 'message': 'Username, foodName, quantityValue and quantityUnits, and calories are required.' });
 
    try {

        //create and store the new user
        const result = await Userfoodlog.create({
            "username": username,
            "calorieGoal": req.body.calorieGoal,
            "mealName": req.body.mealName,
            "logDate": req.body.logDate,
            "foodName": req.body.foodName,
            "quantityUnits": req.body.quantityUnits,
            "quantityValue": req.body.quantityValue,
            "calories": req.body.calories
    });
        
        console.log(result);

        res.status(201).json({ 'success': `New entry for ${username} food log created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewFoodLog };