var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  
    itemCode:String,
    itemCodeType:String,
    itemName:String,
    itemAssemblyName:String,
    itemAmount:Number,
    itemUnits:String,
    itemProvider:String,
    itemBrand:String,
    itemSellPrice:Number,
    itemBuyPrice:Number,
    itemCategorie:String,
    itemLocation:String,
    companyId:String


});

var Item = mongoose.model('Item',itemSchema,'items');

module.exports = Item;