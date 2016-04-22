var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  
    itemCode:{type:String,uppercase: true},
    itemCodeType:{type:String,uppercase: true},
    itemName:{type:String,uppercase: true},
    itemType:{type:String,uppercase: true}, // schraube, zylinder, motor, blech, fertigunsteil
    itemAssemblyName:{type:String,uppercase: true}, // BauGruppe Name,General 
    itemAssemblyNumber:String, // BauGruppe nummer, General
    itemAmount:Number,
    itemUnits:{type:String,uppercase: true},
    itemProvider:{type:String,uppercase: true},
    itemBrand:{type:String, uppercase:true,trim:true },
    itemSellPrice:Number,
    itemBuyPrice:Number,
    itemCategorie:{type:String,uppercase: true}, // Buateile,Normteile,Kaufteile,Brennteile
    itemLocation:{type:String,uppercase: true},
    companyId:{type:String,uppercase: true},
    itemLastPerson:{
        userName:{type:String,uppercase: true},
        userId:{type:String,uppercase: true}
    },
    itemLastDate:Date,
    itemMaterial:{type:String,uppercase: true},
    itemRawMaterialProfil:{type:String,uppercase: true}, // round, squar
    itemRawMaterialDimensions:{type:String,uppercase: true}, // hxwxl
    itemDeliveryTime:{amount:Number,units:String} // 1 dia, 2 semanas, 3 meses



});

var Item = mongoose.model('Item',itemSchema,'items');

module.exports = Item;