var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function assemblies (app,Assembly){

	app.use(bodyParser.json());

	app.get('/assemblies',getAssemblies);
	app.post('/assemblies',newAssembly);
	app.put('/assemblies',updateAssembly);
	app.delete('/assemblies',deleteAssembly);

	function getAssemblies (req,res){

		var query = req.query; // query:{companyId}		
		Assembly.find(query,function (err,array){				
				res.json(array);
		});		
	}

	function newAssembly (req,res) {
			
			Assembly.create(req.body,function (err,obj) {
				res.json(obj);
			});
	}

	function updateAssembly (req,res){

		var query = req.query;
		var todo = req.body;

		function updateItemInAssembly (){ // update item information once a item is inside an Assembly 
			Assembly.findOneAndUpdate(query, //{companyId:code,AssemblyNumber:2345,assemblyItems._id:_id@item}
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

		function insertItemsInAssembly (){ // to insert an item once the assembliy is created
			Assembly.findOneAndUpdate(query,//{companyId:code,'assemblyNumber':11.401......}
										{$addToSet:{assemblyItems:{$each:todo}}},
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
		if(!todo._id && !Array.isArray(todo) && !undefined && !null){
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
		if (Array.isArray(todo)){
			console.log('multiple items inserted');
			insertItemsInAssembly();
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