var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function assemblies (app,Assembly){

	app.use(bodyParser.json());

	app.get('/assemblies',getAssemblies);
	app.post('/assemblies',newAssembly);
	app.put('/assemblies',updateAssembly);
	app.delete('/assemblies',deleteAssembly);

	function getAssemblies (req,res){
		var query = req.query;
		// console.log(query);
		Assembly.find(query,function (err,array){
				// console.log('que monda');
				res.json(array);
		});		
	}

	function newAssembly (req,res) {
			console.log (req.body);
			Assembly.create(req.body,function (err,obj) {
				res.json(obj);
			});
	}

	function updateAssembly (req,res){

		var query = req.query;
		var todo = req.body;
		// console.log(query);
		// console.log(todo);

		function updateItemInAssembly (){
			Assembly.findOneAndUpdate(query, //{companyId:code,AssemblyNumber:2345,assemblyItems._id:_id@user}
										{$set:{'assemblyItems.$':todo}},
										{new:true},function (err,obj){
											res.json(obj);
										});
		
		}

		function deleteItemFromAssembly (){
			Assembly.findOneAndUpdate({companyId:query.companyId,assemblyNumber:query.assemblyNumber},//{companyId:code,'assemblyNumber':11.401......}
										{$pull:{assemblyItems:{itemCode:query.itemCode}}},
										function (err,obj){
											res.json(obj);
										});
		}

		function insertItemInAssembly (){ // to insert an item once the assembliy is created
			Assembly.findOneAndUpdate(query,//{companyId:code,'assemblyNumber':11.401......}
										{$addToSet:{assemblyItems:todo}},
										{new:true},
										function (err,obj){
											res.json(obj);
										});
		}

		function updateAssemblyInfo (){
			Assembly.findOneAndUpdate(query,todo,function (err,obj){
					res.json(obj);
				});	
		}

		if(query.itemCode && todo._id){
			console.log('delete item from Assembly');
			deleteItemFromAssembly();
		}
		if(!todo._id){
			console.log('insert item in assembly');
			insertItemInAssembly();
		}
		if(query['assemblyItems._id'] && todo._id){
			console.log('update item in assembly');
			updateItemInAssembly();
		}
		if (query._id){
			console.log('update assembly Info');
			updateAssemblyInfo();
		}
		
		
	}

	 function deleteAssembly(req,res){
    	var query = req.query;
			Assembly.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
    }


}

module.exports = assemblies;