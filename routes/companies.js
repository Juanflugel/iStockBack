var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function companies (app,Company){

	app.use(bodyParser.json());

	app.get('/company',findCompany);
	app.post('/company',newCompany);
	app.put('/company',updateCompany);

	function findCompany (req,res){
		var query = req.query;
		Company.find(query,function (err,array){
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
			console.log(query,todo);

			function newUser (){ // todo._id === undefined 
				Company.findOneAndUpdate( query,//query {companyId:code}
	    							  {$push:{companyUsers:todo}},
	    							  {new:true},function (error,obj){
	    							  		res.json(obj);
	    							});
			}

			function updateUser(){
				Company.findOneAndUpdate(query, //{companyId:code,'companyUsers._id':_id@user}
										{$set:{'companyUsers.$':todo}},
										{new:true},function (err,obj){
											res.json(obj);
										});
			}

			if(todo._id === undefined){
				newUser();
			}
			else if (query['companyUsers._id']){// se usa esta notacion para que mongo pueda entnder la variable query
				updateUser();
			}
			else {
				console.log('pailas primo');
			}

    }   


}

module.exports = companies;