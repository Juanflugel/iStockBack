var mongoose = require('mongoose'),
	bodyParser = require('body-parser');

	function projects (app,Project){

		app.use(bodyParser.json());

		app.get('/projects',getCompanyProjects);
		app.post('/projects',newProject);
		app.put('/projects',updateProject);
		app.put('/itemsInproject',updateItemsInProject);
		app.delete('/projects', deleteProject);
		app.get('/projectGeneralView', pruebaProject);
		app.get('/requiredAmounts',pruebaAmounts);

		function pruebaAmounts (req,res){ // ruta para mostrar las cantidades necesaria de cada item dependiendo de las los projectos abiertos
			var query = req.query;
			console.log(query);
			Project.aggregate([
							   {$match:query},
							   { $unwind : "$projectAssemblies" },
							   { $unwind : "$projectAssemblies.assemblyItems" },
							   { $project: { projectNumber:1,
							   				 itemCode:'$projectAssemblies.assemblyItems.itemCode',
							   				 itemAmount:'$projectAssemblies.assemblyItems.itemAmount'
							   				}
							   },
							   // {$group:{_id:{itemCode:'$itemCode'},veces:{$sum:1}}}
							   {$group:{_id:{itemCode:'$itemCode'},totalAmount:{$sum:'$itemAmount'}}},
							   {$project:{itemCode:'$_id.itemCode',itemAmount:'$totalAmount'}}// itemAmount =>total amount
							   ],function (err,arr){
				res.json(arr);
			});
		} 

		function pruebaProject(req,res){
			var query = req.query;
			console.log(query);
			
			Project.aggregate( [ {$match: query},
								 {$project:{projectNumber:1,projectName:1,projectType:1,projectItems:1,deadLine:1}},
								 { $unwind : "$projectItems" },
								 {$project:{ projectNumber:1,projectName:1,projectType:1,deadLine:1,itemName:'$projectItems.itemName',
											 itemPrice:'$projectItems.itemBuyPrice',itemAmount:'$projectItems.itemAmount',
											 itemTotalCost :{$multiply:['$projectItems.itemAmount','$projectItems.itemBuyPrice']}
										   }
								 },
								 {$group:{_id:{_id:'$_id',projectNumber:'$projectNumber',projectName:'$projectName',deadLine:'$deadLine',projectType:'$projectType'},
										  totalProjectCost:{$sum:'$itemTotalCost'}
									  }                                         
								 }],function (err,obj){
										res.json(obj);
							});
			// res.json('colombia y su maldita madre');
		}

		function getCompanyProjects (req,res) {

			var query = req.query;
			Project.find(query,function (err,array){
				res.json(array);
			});


		}

		function newProject (req,res) {
			console.log (req.body);
			Project.create(req.body,function (err,obj) {
				res.json(obj);
			});
		}

		function updateProject (req,res){
			// si el re.body es un objeto se va a editar el proyecto en general 
			// si el req.body es una collecion se van a insertar ensambles
			var todo = req.body;
			var query = req.query;

			function updateProjectInfo (){
				Project.findOneAndUpdate(query,todo,function (err,obj){
					res.json(obj);
				});	
			}			

			function insertAssemblies () {
				var assembly = todo;
				Project.findOneAndUpdate(query,// {_id=123......}; req.body [{},{}] assemblies to insert
					{$push:{projectAssemblies:{$each:assembly}}},
					{new:true},function (error,obj){
						console.log('se insertaron varios ensambles');
						res.json(obj);
					});
			}

			function deleteAssemblyFromProject (){// funcion para eliminar un emsanble de un projecto
 
				Project.findOneAndUpdate({companyId:query.companyId,projectNumber:query.projectNumber},// {companyId,projectNumber,projectAssemblies._id}
					{$pull:{'projectAssemblies':{_id:query['projectAssemblies._id']}}},
					{new:true},function (err,obj){
						if(err){
							res.json(err);
							console.log(err);
						}
						else{
							console.log('assembly removed from  Project sucessfully');
							res.json(obj);
						}
					
				});

			}


			if (Array.isArray(todo)){
				insertAssemblies();
			}
			if (query['projectAssemblies._id']){
				console.log('entro a borrar');
				deleteAssemblyFromProject();
			}
			if (query._id && !Array.isArray(todo) ){
				console.log('que es esto');
				updateProjectInfo();
			}

		}

		function updateItemsInProject(req,res){
			// basically to change the atribute isAssembled to true, change a name, pull a item from project or push one new
			var query = req.query;
			var collection = req.body;
			
			Project.findOneAndUpdate(query, //{companyId_id:12234,projectNumber:1234,projectAssemblies.assemblyNumber:908765}
				{ $set: { "projectAssemblies.$.assemblyItems" : collection } },
				{new:true},function (err,obj) {
					res.json(obj);
				});
			

		}

		function deleteProject (req,res){
			var query = req.query;
			console.log(query);
			Project.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
		}

	}

module.exports = projects;