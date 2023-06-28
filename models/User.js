const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name: Sequelize.STRING,
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    Password: Sequelize.STRING,
    ispremiumuser: Sequelize.BOOLEAN,
    totalCost: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
    
});

module.exports = User;