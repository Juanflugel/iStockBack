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
        itemBuyPrice:Number
        }]
    }],
    projectItems:[{
        itemCode:String,
        itemName:String,
        itemAmount:Number,
        itemBuyPrice:Number,
        itemAssemblyName:String, // BauGruppe Name
        itemAssemblyNumber:String, // BauGruppe nummer
        itemAssemblyTime:Date

    }]
 //[{},{},] UN ARRAY CON LOS OBJECTOS ASSEMBLY 

});

var Project = mongoose.model('Project',ProjectSchema,'projects');

module.exports = Project;