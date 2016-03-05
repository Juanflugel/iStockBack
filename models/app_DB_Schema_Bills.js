var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = new Schema({
  
    providerId : String,
    providerName : String,
    providerLogo : String,
    billItems : [{
                  itemId:String,
                  itemName:String,
                  itemAmount:Number,
                  itemUnit:String
                 }]


});

var Bill = mongoose.model('Bill',billSchema,'bills');

module.exports = Bill;