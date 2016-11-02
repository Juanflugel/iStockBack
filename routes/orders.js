var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function orders (app,Order){

	app.use(bodyParser.json());

	app.get('/orders',getOrders);
	app.post('/orders',newOrder);
	app.put('/orders',updateOrder);
	app.delete('/orders',deleteOrder);

	function newOrder (req,res){
		var query = req.query;
		var obj = req.body;
		obj.orderCreationDate = new Date();
		Order.create(obj,function (err,obj){
			console.log('nuevo');
			res.json(obj);
		});	
	}

	function getOrders (req,res){
		// res.json('todo bien primo');
		function getBillById (){
			const query = req.query;
			console.log(query);
			Order.find(query,function (err,array){
			res.json(array);
			});
		}
		if (req.query){
			getBillById();
		}
		
	}

	function updateOrder (req,res){
		var query = req.query;
		var todo = req.body;

		function updateOrderInfo(){
			Order.findOneAndUpdate(query,todo,{new:true},function (err,obj){
				res.json(obj);
			});
		}
		

		function updateItemInOrder (){ // update item information once a item is inside an Assembly 
			Order.findOneAndUpdate(query, //{companyId:code,orderNumber:2345,orderedItems._id:_id@item}
										{$set:{'orderedItems.$':todo}},
										{new:true},function (err,obj){
											res.json(obj);
										});
		
		}

		function insertItemInOrder (){ // to insert an item once the assembliy is created
			Order.findOneAndUpdate(query,//{companyId:code,'orderNUmber':11.401......}
										{$addToSet:{orderedItems:todo}},
										{new:true},
										function (err,obj){
											res.json(obj);
										});
		}

		function deleteItemFromOrder (){
			Order.findOneAndUpdate({companyId:query.companyId,orderNumber:query.orderNumber},//{companyId:code,'assemblyNumber':11.401......}
										{$pull:{orderedItems:{itemCode:query.itemCode}}},{new:true},
										function (err,obj){
											res.json(obj);
										});
		}

		if (query._id){ // id of the order
			updateOrderInfo();
		}

		if(query['orderedItems._id'] && todo._id){ 
			console.log('update item in assembly');
			updateItemInOrder();
		}

		if(!todo._id){
			console.log('nuevo item insertado en la orden');
			insertItemInOrder();
		}

		if(query.itemCode && todo._id){
			console.log('item  deleted from order');
			deleteItemFromOrder();
		}


	}

	function deleteOrder (req,res){
		var query = req.query;
		Order.findOneAndRemove(query,function (err,obj){
			res.json(obj);
		});
	}


}

module.exports = orders;