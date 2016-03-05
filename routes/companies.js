var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function companies (app,Company){

	app.use(bodyParser.json());

	app.get('/company',findCompany);

	function findCompany (req,res){
		Company.find({},function (err,array){
			res.json(array);
		});
	}


}

module.exports = companies;