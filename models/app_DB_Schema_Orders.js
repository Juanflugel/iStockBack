var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  
   orderNumber:String,
   orderCreationDate:Date,
   orderConfirmationDate:Date,
   orderDeliveringDate:Date,
   orderToProvider:String,
   state:String,
   orderItems:[
   			   {
   			   	itemCode:String,
   			   	itemName:String,
   			   	itemAmount:Number,
   			   	itemBrand:String,
                  itemType:String,
                  itemProvider:String,
                  itemPrice:Number
               }
              ] 
    


});

var Order = mongoose.model('Order',orderSchema,'orders');

module.exports = Order;