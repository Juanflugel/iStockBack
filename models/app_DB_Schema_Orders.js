var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({

   companyId :String,
   orderNumber:String,
   projectNumbers:[String],
   orderCreationDate:Date,
   orderConfirmationDate:Date,
   orderPaymentDate:Date,
   orderDeliveringDate:Date,
   orderProvider:String,
   businessPartner:String,
   tel: String,
   orderState:String, // open , close
   orderStatus:String, // ordered, paid, delivered
   orderedItems:[
   			   {
   			   	itemCode:String,
   			   	itemName:String,
   			   	amountOrdered:Number,
   			   	itemBrand:String,
                  itemType:String,
                  itemProvider:String,
                  itemPrice:Number
               }
              ] 
    


});

var Order = mongoose.model('Order',orderSchema,'orders');

module.exports = Order;