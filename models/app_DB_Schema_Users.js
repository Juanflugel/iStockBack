var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  
   userRealName:String,
   userRealLastName:String,
   userName:String,
   userRole:String,
   userPassWord:String,
   companyId:String,
   email: {
    type: String,
    unique: true,
    required: true
   },
   hash: String,
   salt: String
    


});

var User = mongoose.model('User',userSchema,'users');

module.exports = User;