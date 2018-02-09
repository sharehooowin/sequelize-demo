var Sequelize = require('sequelize');
const sequelize = require("../config/sequelize.js");

var Student = sequelize.defineModel('students',{
    name:{
        type:Sequelize.STRING(100),
        unique:true,
    },
    sex:{
        type:Sequelize.STRING(100)
    },
})

module.exports = Student;