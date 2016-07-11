var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function bills (app,Bill){

	app.use(bodyParser.json());

	app.get('/bills',getBills);
	app.post('/bills',newBill);

	function newBill (req,res){
		Bill.create(req.body,function (err,obj){
			console.log('nuevo');
			res.json(obj);
		});	
	}

	function getBills (req,res){
		// res.json('todo bien primo');
		function getBillById (){
			const query = req.query;
			console.log(query);
			Bill.find(query,function (err,array){
			res.json(array);
		});
		}
		if (req.query){
			getBillById();
		}
		
	}


}

module.exports = bills;
