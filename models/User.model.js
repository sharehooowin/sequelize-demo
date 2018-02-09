var Sequelize = require('sequelize');
const sequelize = require("../config/sequelize.js");

var User = sequelize.defineModel('users',{
    name:{
        type:Sequelize.STRING(100),
        unique:true,
    },
    pwd:{
        type:Sequelize.STRING(100)
    },
    email:{
        type:Sequelize.STRING(100)
    }
})

module.exports = User;