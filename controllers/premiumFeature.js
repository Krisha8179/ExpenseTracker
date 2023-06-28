const User = require('../models/User');
const Expense = require('../models/Expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res) => {
    try{

        const leaderBoardForUsers = await User.findAll({
            attributes: ['id', 'Name', 'totalCost'],
            order:[['totalCost','DESC']]
        })

        res.status(200).json(leaderBoardForUsers);

    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}