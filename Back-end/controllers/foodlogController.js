const Userfoodlog = require('../model/Userfoodlog');

const handleNewFoodLog = async (req, res) => {
    const { username, meals} = req.body;
    if (!username || !meals) return res.status(400).json({ 'message': 'Username and meals are required.' });
 
    try {

        //create and store the new user
        const result = await Userfoodlog.create({
            "username": username,
            "calorieGoal": req.body.calorieGoal,
            "meals": meals,
    });
        console.log(result);
        res.status(201).json({ 'success': `New entry for ${username} food log created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const getUsersLog = async (req,res) => {
    const usersLog = await Userfoodlog.find();
    if (!usersLog) return res.status(204).json({'message':'No log found.'});
    res.json(usersLog);
}

const getUserLog = async (req,res) => {
    if(isNaN(parseInt(req.params.username))) {
        const userLog = await Userfoodlog.find({username:req.params.username});
        if (!userLog) return res.status(204).json({"message": `No name matches ${req.params.username}.`});
        res.json(userLog);
    }
    else {
        const idLog = await Userfoodlog.find({_id:req.params.username});
        if (!idLog) return res.status(204).json({"message": `No id matches ${req.params.username}.`});
        res.json(idLog);
    }
}

const deleteFoodLog = async (req,res) => {
    const {username} = req.body;
    if(!username) return res.status(400).json({'message': 'username required.'});
    const userLog = await Userfoodlog.findOne({username:req.body.username}).exec();
    if (!userLog) return res.status(204).json({'message': `username ${req.body.username} not found.`});
    const result = await userLog.deleteOne({username: req.body.username});
    res.json(result);
}

const updateFoodLog = async (req,res) => {
    const {username} = req.body;
    if(!username) return res.status(400).json({'message': 'username required.'});
    const userLog = await Userfoodlog.findOne({username:req.body.username}).exec();
    if (!userLog) return res.status(204).json({'message': `username ${req.body.username} not found.`});
    if (req.body?.calorieGoal) userLog.calorieGoal = req.body.calorieGoal;
    if (req.body?.meals) userLog.meals = req.body.meals;
    if (req.body?.foodIDs) userLog.foodIDs = req.body.foodIDs;
    const result = await userLog.save();
    res.json('updated '+result);
    console.log('updated result', result)
}
module.exports = { 
    handleNewFoodLog,
    getUsersLog,
    getUserLog,
    deleteFoodLog,
    updateFoodLog
};