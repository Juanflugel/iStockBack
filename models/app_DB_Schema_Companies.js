var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  
    companyName:String,
    companyId:String,
    companyZipCode:String,
    companyUsers:[{
        userName:String,
        userId:String
    }],
    companyPlaces:[{
    	placeId:String,
    	placeName:String
    }]
    


});

var Company = mongoose.model('Company',companySchema,'companies');

module.exports = Company;