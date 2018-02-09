var config = require('./config.js');
var uuidv4 = require('uuid/v4');
const Sequelize = require('sequelize');

console.log('sequelize init...');

var sequelize = new Sequelize(
    config.dbConfig.database,
    config.dbConfig.username,
    config.dbConfig.password,
    {
        host:config.dbConfig.host,
        dialect:'mysql',
        pool:{
            max:20,
            min:5,
            idle:10000
        }
    }
);

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name,attributes){
    var attrs = {};

    for(let key in attributes){ //字段默认不允许为空,除非特殊指明
        let value = attributes[key];
        value.allowNull = value.allowNull || false;
        attrs[key] = value;
    }

    // 统一主键名为id,且类型为STRING(50)
    attrs.id = {
        type:ID_TYPE,
        primaryKey:true
    }

    //默认为每个model添加createAt,和updateAt字段
    // attrs.createAt = {
    //     type:Sequelize.BIGINT,
    //     allowNull:false
    // }
    // attrs.updateAt = {
    //     type:Sequelize.BIGINT,
    //     allowNull:false
    // }


    return sequelize.define(name,attrs,{
        tableName:name,
        timestamps:false,
        hooks:{
            beforeValidate:function(obj){
                if(obj.isNewRecord){
                    if(!obj.id){
                        obj.id = uuidv4();
                    }
                }
            }
        }
    });

};


module.exports = {
    defineModel:defineModel
}
