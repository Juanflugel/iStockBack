var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  
    projectNumber:String,
    projectName:String,
    projectType:String, // Werkzeuge,Maschine,Subassembly
    companyId:String,
    openDate:Date,
    deadLine:Date,
    projectState:String,
    isSubAssembly:Number,
    projectItems:[{
        itemCode:String,
        itemName:String,
        itemAmount:Number,
        itemBuyPrice:Number,
        itemAssemblyName:String, // BauGruppe Name
        itemAssemblyNumber:String, // BauGruppe nummer
        itemAssemblyTime:Date

    }]


});

var Project = mongoose.model('Project',ProjectSchema,'projects');

module.exports = Project;