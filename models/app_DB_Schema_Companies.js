var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  
    companyName:String,
    companyId:String,
    companyZipCode:String,
    companyAddress:String,
    companyLogo:String,
    companyProjectsType:[String], // WERKZEUGE,MASCHINE,MOLD
    companyUsers:[{
                    realName:String,
                    userName:String,
                    userId:String
                }],
    companyLocations:[{
    	locationId:String,
    	locationName:String
    }]
    


});

var Company = mongoose.model('Company',companySchema,'companies');

module.exports = Company;