
var mongoose = require('mongoose');

mongoose.set('strictQuery',false)
var mongoDBURL = 'mongodb://localhost:27017/ecom';

mongoose.connect(mongoDBURL,).then (()=>{
    console.log('Connection Established to dataBase')

}).catch (err =>console.log(err) );





