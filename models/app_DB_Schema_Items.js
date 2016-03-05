var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  
    itemCode:String,
    itemType:String,
    itemName:String,
    itemAmount:Number,
    itemUnits:String,
    itemProvider:String,
    itemBrand:String,
    itemSellPrice:Number,
    itemBuyPrice:Number,
    companyId:String


});

var Item = mongoose.model('Item',itemSchema,'items');

module.exports = Item;