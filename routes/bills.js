var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function bills (app,Bill){

	app.use(bodyParser.json());

	app.get('/prueba',prueba);

	function prueba (req,res){
		Bill.find({},function (err,array){
			res.json(array);
		});
	}


}

module.exports = bills;
