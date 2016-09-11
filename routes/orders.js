var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function orders (app,Order){

	app.use(bodyParser.json());

	app.get('/orders',getOrders);
	app.post('/orders',newOrder);

	function newOrder (req,res){
		Order.create(req.body,function (err,obj){
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


}

module.exports = orders;