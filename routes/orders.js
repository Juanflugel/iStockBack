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
		if (query._id){
			updateOrderInfo();
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