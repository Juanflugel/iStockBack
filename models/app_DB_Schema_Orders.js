var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  
   orderNumber:String,
   orderCreationDate:Date,
   orderToProvider:String,
   orderItems:[
   			   {
   			   	itemCode:String,
   			   	itemName:String,
   			   	itemAmount:Number,
   			   	itemBrand:String,
                  itemType:String,
                  itemProvider:String
               }
              ] 
    


});

var Order = mongoose.model('Order',orderSchema,'orders');

module.exports = Order;