
# sequelize-model
sequelize，一个用于nodejs环境的mysql orm。
sequelize-model，统一规则的且自动化管理Model定义和引入的sequelize封装。
## Installation
    $ npm install
    
## dependencies
* mysql2:1.5.2
* sequelize:4.33.0
* uuid：3.2.1

## package.json
    {
      "dependencies": {
        "mysql2": "^1.5.2",
        "sequelize": "^4.33.0",
        "uuid": "^3.2.1"
      }
    }
    
## 说明
每个人建立Model的风格都不一样，但这样不便于管理。
所以我们需要一个统一的模型，强迫所有Model都遵守同一个规范，这样不但实现简单，而且容易统一风格。
### 统一规则
 所有的Model统一存放在文件夹models内，并且以 名字+"model.js"命名，例如：User.model.js,Student.Model.js等等。
 其次每个Model的定义统一的规范：
 * 1.统一主键，名称必须是id，类型必须是STRING(50)；
 * 2.所有字段默认为NOT NULL，除非显式指定；
 * 3.每个Model的属性字段都以对象的形式定义；
 * 4.统一timestamp机制，默认不这时时间戳。
  User.model.js的定义应该如下：
        
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
 
 然后通过sequelize.js来暴露一个定义模型的统一接口：
    
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
  
  ### 使用Model
  要使用Model，就需要引入对应的Model文件，例如：User.js。一旦Model多了起来，如何引用也是一件麻烦事。
  自动化永远比手工做效率高，而且更可靠。我们写一个model.js，自动扫描并导入所有Model：
  	
    	const fs = require('fs');
   	    const sequelize = require('./sequelize.js');
    	var path = require('path');
    
    	let files = fs.readdirSync(path.join(__dirname,'../models'));
    
    	let js_files = files.filter( file => {
        	return file.endsWith('.model.js');
    	},files);
  
  		module.exports = {}
    
    	var model = {}
    	for(let filename of js_files){
        	let modelName = filename.substring(0,filename.length-10);
        	model[modelName] = require(path.join(__dirname,'../models/'+filename));
    	}
    
    	module.exports = model;
 
 ### 数据库配置:config.js
    	module.exports = {
            dbConfig:{
                host:'localhost',
                database:'test',
                username:'root',
                password:'root',
                port:3306
            }
    	}
    
  ### 使用:app.js
  做完这些封装，就可以很简单的引入这些按规则定义的模型：
   
        var model = require('./config/model.js');
        console.log(model);
         model.User.create({
             name:'user1',
             pwd:'123456',
             email:'244717055@qq.com',
         }).then(function(result){
             console.log(JSON.stringify(result));
         });

        model.User.findAll().then(function(result){
        	console.log(JSON.stringify(result[0]));
    	});
  
    
