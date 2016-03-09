var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function companies (app,Company){

	app.use(bodyParser.json());

	app.get('/company',findCompany);
	app.post('/company',newCompany);
	app.put('/company',updateCompany);

	function findCompany (req,res){
		Company.find({},function (err,array){
			console.log(array);
			res.json(array);

		});
	}

	function newCompany(req,res){
		Company.create(req.body,function (err,obj){
			res.json(obj);
		});
	}

	function updateCompany (req,res){
		var query = req.query;
		var todo = req.body;
            Company.findOneAndUpdate({'_id':query.idCompany},todo,
            {new:true},function (err,obj){
                res.json(obj);
            });
        }   


}

module.exports = companies;