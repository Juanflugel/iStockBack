var mongoose = require('mongoose'),
	bodyParser = require('body-parser');

	function projects (app,Project){

		app.use(bodyParser.json());

		app.get('/projects',getCompanyProjects);
		app.post('/projects',newProject);
		app.put('/projects',updateProject);
		// app.put('/itemToProject',itemToProject);
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

			if (Array.isArray(todo)){
				insertAssemblies();
			}
			else{
				updateProjectInfo();
			}
		}

		// function itemToProject (req,res) {
		// 	var query = req.query; //{projectNumber:number}
		// 	var item = req.body; // can be just an Object or a Collection			

		// 	if (Array.isArray(item)){ // insert a complete collection 
		// 		item[0].itemAssemblyTime = new Date();
		// 		Project.findOneAndUpdate( query,// {projectNumber: 123455}
		// 							  {$push:{projectItems:{$each:item}}},
		// 							  {new:true},function (error,obj){
		// 							  	console.log('se metieron varios items');
		// 									res.json(obj);
		// 		});
		// 	}
		// 	else { // insert just an item
		// 		item.itemAssemblyTime = new Date();
		// 		Project.findOneAndUpdate( query,// {projectNumber: 123455}
		// 							  {$push:{projectItems:item}},
		// 							  {new:true},function (error,obj){
		// 									res.json(obj);
		// 		});
		// 	}
			
		// }


		function deleteProject (req,res){
			var query = req.query;
			Project.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
		}

	}

module.exports = projects;