var mongoose = require('mongoose'),
	bodyParser = require('body-parser');

	function projects (app,Project){

		app.use(bodyParser.json());

		app.get('/projects',getCompanyProjects);
		app.post('/projects',newProject);
		app.put('/projects',updateProject);
		app.put('/itemToProject',itemToProject);
		app.delete('/projects', deleteProject);
		app.get('/projectGeneralView', pruebaProject);

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
			Project.find(query.companyId,function (err,array){
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
			var todo = req.body;
			var query = req.query;
			Project.findOneAndUpdate(query,todo,function (err,obj){
				res.json(obj);
			});
		}

		function itemToProject (req,res) {
			var query = req.query; //{projectNumber:number}
			var item = req.body;
			

			if (Array.isArray(item)){ // insert a complete collection 
				item[0].itemAssemblyTime = new Date();
				Project.findOneAndUpdate( query,// {projectNumber: 123455}
									  {$push:{projectItems:{$each:item}}},
									  {new:true},function (error,obj){
											res.json(obj);
				});
			}
			else { // insert just an item
				item.itemAssemblyTime = new Date();
				Project.findOneAndUpdate( query,// {projectNumber: 123455}
									  {$push:{projectItems:item}},
									  {new:true},function (error,obj){
											res.json(obj);
				});
			}
			
		}

		function deleteProject (req,res){
			var query = req.query;
			Project.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
		}

	}

module.exports = projects;