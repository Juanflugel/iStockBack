var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function companies (app,Company){

	app.use(bodyParser.json());

	app.get('/company',findCompany);
	app.post('/company',newCompany);
	app.put('/company',updateCompany);
	app.put('/companyFilters',updateCompanyFilters);
	app.delete('/company',deleteCompany);

	function findCompany (req,res){
		var query = req.query;
		Company.find(query,function (err,array){
			//console.log(array);
			res.json(array);

		});
	}

	function newCompany(req,res){
		Company.create(req.body,function (err,obj){
			res.json(obj);
		});
	}
	// CRUD company - CRUD User - CRUD Providers
	function updateCompany (req,res){
			var query = req.query;
			var todo = req.body;
			console.log(query,todo.providerName,todo._id);
			// console.log(todo);

			function updateCompanyInfo(){ // query{_id:as34664} 
				Company.findOneAndUpdate(query,todo,{new:true},function (err,obj){
					res.json(obj);
				});

			}
			// user related CRUD
			function newUser (){ // todo.userName === undefined 
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
			// user related CRUD
			// provider related CRUD
			function newProvider (){
				Company.findOneAndUpdate( query,//query {companyId:code}
	    							  {$push:{companyProviders:todo}},
	    							  {new:true},function (error,obj){
	    							  		res.json(obj);
	    							});

			}
			function updateProvider(){
				Company.findOneAndUpdate(query, //{companyId:code,'companyUsers._id':_id@user}
										{$set:{'companyProviders.$':todo}},
										{new:true},function (err,obj){
											res.json(obj);
										});
			}
			function deleteProvider(){
				Company.findOneAndUpdate({companyId:query.companyId},//{companyId:code,'userId':_id@user}
										{$pull:{companyProviders:{_id:query.providerId}}},
										function (err,obj){
											res.json(obj);
										});
			}

			if (query.userId){
				console.log('primer paso para eliminar');
				deleteUser();
			}
			else if(Object.keys(todo).length != 0 && todo.userName && todo._id === undefined){
				console.log('primer paso para nuevo user');
				newUser();
			}
			else if (query['companyUsers._id'] && req.body){// se usa esta notacion para que mongo pueda entnder la variable query
				console.log('primer paso para actualizar');
				updateUser();
			}
			else if (query._id == todo._id && todo._id != undefined) {
				updateCompanyInfo();
			}
			else if(Object.keys(todo).length != 0 && todo.providerName && todo._id === undefined){
				console.log('entro en nuevo proveedor');
				newProvider();
			}
			else if (query['companyProviders._id'] && req.body){// se usa esta notacion para que mongo pueda entnder la variable query
				console.log('primer paso para actualizar provider');
				updateProvider();
			}
			else if (query.providerId){
				console.log('primer paso para eliminar proveedor');
				deleteProvider();
			}

    }

    function updateCompanyFilters (req,res){

    	var query = req.query;
    	
    	function newFilterTag (){
    		Company.findOneAndUpdate(query,//{companyId:RMB01,companyItemFilters.queryObjKey}
    								{$push:{'companyItemFilters.$.array':req.body.cuerpo}},
    								{new:true},function (err,obj){
    									res.json(obj);
    								}	
    			)
    	}

    	function deleteFilterTag (){
    		Company.findOneAndUpdate(query,//{companyId:RMB01,companyItemFilters.queryObjKey}
    								{$pull:{'companyItemFilters.$.array':req.body.tagToRemove}},
    								{new:true},function (err,obj){
    									res.json(obj);
    								}
    			)
    	}

    	if(req.body.tagToRemove){
    		console.log(query);
    		deleteFilterTag();
    	}
    	else {
    		newFilterTag();
    	}
    }

    function deleteCompany (req,res){
    	var query = req.query;
			Company.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
    }   


}

module.exports = companies;