var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssemblySchema = new Schema({
  
    assemblyNumber:String,
    assemblyName:String,
    companyId:String,
    assemblyItems:[{
        itemCode:String,
        itemName:String,
        itemAmountInAssembly:Number,
        itemBuyPrice:Number
    }]


});

var Assembly = mongoose.model('Assembly',AssemblySchema,'assemblies');

module.exports = Assembly;