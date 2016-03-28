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
			// console.log(todo);

			function updateCompanyInfo(){ // query{_id:as34664} 
				Company.findOneAndUpdate(query,todo,{new:true},function (err,obj){
					res.json(obj);
				});

			}

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

			function deleteUser(){
				Company.findOneAndUpdate({companyId:query.companyId},//{companyId:code,'userId':_id@user}
										{$pull:{companyUsers:{_id:query.userId}}},
										function (err,obj){
											res.json(obj);
										});


			}

			if (query.userId){
				console.log('primer paso para eliminar');
				deleteUser();
			}
			else if(Object.keys(todo).length != 0 && todo._id === undefined){
				console.log('primer paso para nuevo user');
				newUser();
			}
			else if (query['companyUsers._id'] && req.body){// se usa esta notacion para que mongo pueda entnder la variable query
				console.log('primer paso para actualizar');
				updateUser();
			}
			else if (query._id == todo._id) {
				updateCompanyInfo();
			}

    }   


}

module.exports = companies;