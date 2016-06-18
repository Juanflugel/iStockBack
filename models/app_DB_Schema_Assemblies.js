var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssemblySchema = new Schema({
  
    assemblyNumber:String,
    assemblyName:String,
    companyId:String,
    assemblyImage:String,
    assemblyItems:[{
        itemCode:String,
        itemName:String,
        itemAmount:Number// specific amount in assembly

    }]


});

var Assembly = mongoose.model('Assembly',AssemblySchema,'assemblies');

module.exports = Assembly;