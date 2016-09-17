var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  
   userRealName:String,
   userRealLastName:String,
   userName:String,
   userRole:String,
   userPassWord:String,
   companyId:String
    


});

var User = mongoose.model('User',userSchema,'users');

module.exports = User;