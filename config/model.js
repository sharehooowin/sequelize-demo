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