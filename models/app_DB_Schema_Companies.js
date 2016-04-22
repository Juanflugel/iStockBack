var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  
    companyName:String,
    companyId:String,
    companyZipCode:String,
    companyAddress:String,
    companyLogo:String,
    companyProjectsType:[String], // WERKZEUGE,MASCHINE,MOLD
    // filter Collection to filter items
    companyItemFilters:[{tagToShow:String,queryObjKey:String,array:[String]}],
    // company users collection
    companyUsers:[{realName:String,userName:String,userId:String}],
    // items' locations collection
    companyLocations:[{locationId:String,locationName:String}],
    // company providers collection
    companyProviders:[{providerName:String,providerTel:String}]

});

var Company = mongoose.model('Company',companySchema,'companies');

module.exports = Company;