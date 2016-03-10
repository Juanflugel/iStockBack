var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  
    projectNumber:String,
    companyId:String,
    projectItems:[{
        itemCode:String,
        itemName:String,
        itemAmount:Number,
        itemPrice:Number,        
    }]


});

var Project = mongoose.model('Project',ProjectSchema,'projects');

module.exports = Project;