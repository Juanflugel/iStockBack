var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  
    projectNumber:String,
    projectName:String,
    projectType:String, // Werkzeuge,Maschine
    companyId:String,
    openDate:Date,
    deadLine:Date,
    projectState:String,// open or closed
    projectAssemblies:[{
        assemblyName:String,
        assemblyNumber:String,
        assemblyItems:[{
        itemCode:String,
        itemName:String,
        itemAmount:Number, // specific amount in assembly
        itemProvider:String,
        itemBuyPrice:Number,
        itemType:String,
        itemCategorie:String,
        itemAssembled:Boolean
        }]
    }]

});

var Project = mongoose.model('Project',ProjectSchema,'projects');

module.exports = Project;