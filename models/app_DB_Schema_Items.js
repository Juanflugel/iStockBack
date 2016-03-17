var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  
    itemCode:String,
    itemCodeType:String,
    itemName:String,
    itemType:String, // schraube, zylinder, motor, blech, fertigunsteil
    itemAssemblyName:String, // BauGruppe Name,General 
    itemAssemblyNumber:String, // BauGruppe nummer, General
    itemAmount:Number,
    itemUnits:String,
    itemProvider:String,
    itemBrand:String,
    itemSellPrice:Number,
    itemBuyPrice:Number,
    itemCategorie:String, // Buateile,Normteile,Kaufteile,Brennteile
    itemLocation:String,
    companyId:String,
    itemLastPerson:{
        userName:String,
        userId:String
    },
    itemLastDate:Date,
    itemMaterial:String,
    itemRawMaterial:String


});

var Item = mongoose.model('Item',itemSchema,'items');

module.exports = Item;