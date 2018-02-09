var model = require('./config/model.js');

console.log(model);

// model.User.create({
//     name:'user1',
//     pwd:'123456',
//     email:'244717055@qq.com',
// }).then(function(result){
//     console.log(JSON.stringify(result));
// });

model.User.findAll().then(function(result){
    console.log(JSON.stringify(result[0]));
});

