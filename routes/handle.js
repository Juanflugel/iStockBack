var mongoose = require ('mongoose');
var _= require('underscore');
var bodyParser = require('body-parser');
var json2csv = require('nice-json2csv');

function resumeCodeAndAmount (collection) { // funcion para reducir todo solo a codigo y cantidad
		const sample = [];
		_.each(collection,function (obj) {
		  const a = [obj.itemCode,obj.itemAmount];
		  sample.push(a);
		});
		return sample;
}

function subtract2arrays  (a,b) { // a = array whit values from Stock ['itemCode',3]; b= array from values from the project ['itemCode',5]
	  var diff = [];
	  const lb = b.length;
	  _.each(a,function (aObj) {
		for( i=0 ; i<lb ;i++){
		  var bObj = b[i];
		  if (aObj[0] == bObj[0]){
			diff.push([aObj[0],aObj[1]-bObj[1]]);
		  }
		}
	  });
	  return diff;
 }

function checkIfNegative(collection){ // to find all with negative values
	  var allNegative = [];
	  _.each(collection,function (array){
			if(array[1]<0){
			  allNegative.push(array);
			}
	  })
	  return allNegative;
}

function getJustCodes (collection){
	var codes =[];
	_.each(collection,function(array){
		codes.push(array[0]);
	});
	return codes;
}

function remainingAmount(colItems,colCAA){
 // entra la coleccion de items y se la añade las cantidades restantes segun lospryectos pendientes
	var rl = colCAA.length; //reference length to make the for
	var newColWhitRemaining = [];
	_.each(colItems,function (objItem){

		for (i=0;i<rl;i++){
			if(objItem.itemCode == colCAA[i][0]){
				// console.log(colCAA[i]);
				objItem.remainingAmount = colCAA[i][1];
				// console.log(objItem,colCAA[i][1]);
				 newColWhitRemaining.push(objItem);
			}
		}
	});

	return newColWhitRemaining;
}


function handle (app,Item,Project){

	app.use(bodyParser.json());

	app.get('/handleProjects',totalAmounts);
	app.get('/pendingInProject',pendingInProject);
	app.get('/insertedItems',insertedItems);
	app.put('/handleProjects',updateProject);



	function totalAmounts(req,res){ // to show in pendings all items they lack of and how many
		var query = req.query;      
		console.log(query);
		var codesAndAmounts = []; // ['12345',3......] array collection with just codes ans amounts from items that are needed to complete a project
		var codesAndAmountsFromStock = []; //['12345',3......] array collection with just codes ans amounts from items that are in Stock
		var negativeAmounts = []; // array collection with all items wich have a negative amount afer the stock amount and amount need were compared
		var arrayWithCodes = [];
		var arrayQuery = [
							  { $match:query },
							  { $unwind : "$projectAssemblies" },
							  { $unwind : "$projectAssemblies.assemblyItems" },
							  { $match:{'projectAssemblies.assemblyItems.itemAssembled':{$ne:true}}},
							  { $project: { projectNumber:1,
											itemCode:'$projectAssemblies.assemblyItems.itemCode',
											itemAmount:'$projectAssemblies.assemblyItems.itemAmount'
										  }
							  },
							  {$group:{_id:{itemCode:'$itemCode'},totalAmount:{$sum:'$itemAmount'}}},
							  {$project:{itemCode:'$_id.itemCode',itemAmount:'$totalAmount'}}
						 ];

			Project.aggregate(arrayQuery,function (err,arr){

				codesAndAmounts = resumeCodeAndAmount(arr);

				Item.find({'companyId':query.companyId},function (err,array){

					codesAndAmountsFromStock = resumeCodeAndAmount(array);									
					negativeAmounts = checkIfNegative(subtract2arrays(codesAndAmountsFromStock,codesAndAmounts));
					var justCodesWithNegative = getJustCodes(negativeAmounts);


					Item.aggregate([
						{$match:{'companyId':query.companyId,'itemCode':{$in:justCodesWithNegative}}},
						{$project:
							{_id:0,itemCode:1,itemAmount:1,itemName:1,itemType:1,itemProvider:1,remainingAmount:1,itemAssemblyName:1
							}
						}],function(err,col){
							colToDownload = remainingAmount(col,negativeAmounts);
							res.json(colToDownload);
					});
				
				});


			});
	

	}

	function insertedItems(req,res){ // to show in a project all items that are assembled 
			var query = req.query;
			
			Project.aggregate([
							   {$match:{'companyId':query.companyId,'projectState':query.projectState}}, // {companyId,_id,projectAssembly.assemblyNumber}
							   { $unwind : "$projectAssemblies" },
							   { $unwind : "$projectAssemblies.assemblyItems" },
							   { $project: { projectNumber:1,
											 itemCode:'$projectAssemblies.assemblyItems.itemCode',
											 itemAmount:'$projectAssemblies.assemblyItems.itemAmount',
											 itemAssembled:'$projectAssemblies.assemblyItems.itemAssembled'
										   }
							   },
							   {$match:{itemCode:{$in:query.codesArray}}},
							   {$match:{itemAssembled:true}},
							   {$group:{_id:{itemCode:'$itemCode'},totalAmount:{$sum:'$itemAmount'}}},
							   {$project:{itemCode:'$_id.itemCode',itemAmount:'$totalAmount'}}// itemAmount =>total amount


							   ],function (err,array){
								//console.log('todo bien');
								res.json(array);
							   });
	}

	


	function updateProject (req,res){ // funcion para actualizar los itenes insertados en un projecto

		var query = req.query; 
		var arrayItems = req.body;
 // cambiar el query para buscar el assembly por Id en caso que halla mas de un assembly igual por proyecto
		Project.findOneAndUpdate(query,// {companyId,projectNumber,projectAssemblies.assemblyNumber}
			{$set:{'projectAssemblies.$.assemblyItems':arrayItems}},
			{new:true},function (err,obj){
				if(err){
					res.json(err);
				}
				else{
					console.log('items inserted in Project sucessfully');
					res.json(obj);
				}
				
			});

	}

	function pendingInProject (req,res){
		var query = req.query; //{companyId:@id,projectState:open,projectNumber:[@projectNumber],codesArray[itemsCode]}
		    
		var arrayQuery = [
							  { $match:{'companyId':query.companyId,'projectState':query.projectState,'projectNumber':{$in:query.projectsArray}}},
							  { $unwind : "$projectAssemblies" },
							  { $unwind : "$projectAssemblies.assemblyItems" },
							  { $project: { projectNumber:1,
											itemCode:'$projectAssemblies.assemblyItems.itemCode',
											itemAmount:'$projectAssemblies.assemblyItems.itemAmount',
											itemAssembled:'$projectAssemblies.assemblyItems.itemAssembled'
										  }
							  },
							  {$match:{itemCode:{$in:query.codesArray}}},
							  {$group:{_id:{projectNumber:'$projectNumber',
							  				itemCode:'$itemCode',
							  				itemAssembled:'$itemAssembled'},
							  				totalAmount:{$sum:'$itemAmount'}
							  		  }
							  },
							  {$project: {_id:0,projectNumber:'$_id.projectNumber',
							  				itemCode:'$_id.itemCode',
							  				itemAssembled:'$_id.itemAssembled',
							  				totalAmount:'$totalAmount'}},
							  {$group:{_id:{itemCode:'$itemCode',projectNumber:'$projectNumber'},resume:{$push:{amount:'$totalAmount',itemAssembled:'$itemAssembled'}}}},
							  {$project:{_id:0,
							  				projectNumber:'$_id.projectNumber',
							  				itemCode:'$_id.itemCode',
							  				muestra:'$resume'}}							  
							  
						 ];

				 			 

		Project.aggregate(arrayQuery,function (err,arr){
			
			var arreglo =_.each(arr,function (obj){	

				if(obj.muestra.length ===1){
					obj.netoAmount = obj.muestra[0].amount;
					obj.itemAssembled = obj.muestra[0].itemAssembled;
					return obj;
				}
				else{
					_.each(obj.muestra,function (i){
						 if(i.itemAssembled === false){
						 	obj.netoAmount = i.amount;
							obj.itemAssembled = i.itemAssembled;
							return obj;
						};
					});
				}
			});
			console.log(query);
			res.json(arreglo);
		});

	}


}

module.exports = handle;