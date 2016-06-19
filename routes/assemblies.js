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
		console.log(query);

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

		if(query.itemCode){
			deleteItemFromAssembly();
		}
		if(query['assemblyItems._id'] && req.body){
			updateItemInAssembly();
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