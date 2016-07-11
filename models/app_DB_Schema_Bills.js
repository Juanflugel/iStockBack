var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = new Schema({
  
    billId:String,
	providerId:String,
	providerName:String,
	providerImage:String,
	mallAddress:String,
	purchaseDate:Date,
	totalPaid:Number,
	currency:String,
	bougthProducts:[{
		itemId:String,
		itemImage:String,
		itemName:String,
		itemLastDate:Date,
		itemAmount:Number,
		itemUnits:String,
		itemPrice:Number,
		itemPriceCurrency:String

	}]


});

var Bill = mongoose.model('Bill',billSchema,'bills');

module.exports = Bill;