const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: Sequelize.STRING,
    amount:  Sequelize.INTEGER,
    category: Sequelize.STRING
    
});

module.exports = Expense;