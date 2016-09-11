var mongoose = require ('mongoose');
var _= require('underscore');
var bodyParser = require('body-parser');
var csv = require('express-csv');
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
	app.get('/insertedItems',insertedItems);
	app.put('/handleProjects',updateProject);
	app.get('/csv',csv);

	function csv (req,res){

		
			Item.aggregate([
					{$match:{}},
					{ $project: {_id: 0 ,itemCode:1, itemAmount:1}
								   }
				],function (err,array){
				res.csv(array, "myFile.csv");
			});

			// var d = JSON.stringify(array);
			// console.log(typeof d);
			// var obj = JSON.parse(d);
			// console.log(typeof obj);
			// res.csv(JSON.stringify(array), "myFile.csv");	
			
		
	}


	function totalAmounts(req,res){ // to show in pendings all items they lack of and how many
		var query = req.query;      
		
		var codesAndAmounts = []; // ['12345',3......] array collection with just codes ans amounts from items that are needed to complete a project
		var codesAndAmountsFromStock = []; //['12345',3......] array collection with just codes ans amounts from items that are in Stock
		var negativeAmounts = []; // array collection with all items wich have a negative amount afer the stock amount and amount need were compared
		var arrayWithCodes = [];
		var arrayQuery = [
								   {$match:query},
								   { $unwind : "$projectAssemblies" },
								   { $unwind : "$projectAssemblies.assemblyItems" },
								   {$match:{'projectAssemblies.assemblyItems.itemAssembled':{$ne:true}}},
								   { $project: { projectNumber:1,
												 itemCode:'$projectAssemblies.assemblyItems.itemCode',
												 itemAmount:'$projectAssemblies.assemblyItems.itemAmount',

												}
								   },
								   // {$group:{_id:{itemCode:'$itemCode'},veces:{$sum:1}}}
								   {$group:{_id:{itemCode:'$itemCode'},totalAmount:{$sum:'$itemAmount'}}},
								   {$project:{itemCode:'$_id.itemCode',itemAmount:'$totalAmount'}}];
			Project.aggregate(	arrayQuery
								   // {$match:query},
								   // { $unwind : "$projectAssemblies" },
								   // { $unwind : "$projectAssemblies.assemblyItems" },
								   // {$match:{'projectAssemblies.assemblyItems.itemAssembled':{$ne:true}}},
								   // { $project: { projectNumber:1,
											// 	 itemCode:'$projectAssemblies.assemblyItems.itemCode',
											// 	 itemAmount:'$projectAssemblies.assemblyItems.itemAmount',

											// 	}
								   // },
								   // // {$group:{_id:{itemCode:'$itemCode'},veces:{$sum:1}}}
								   // {$group:{_id:{itemCode:'$itemCode'},totalAmount:{$sum:'$itemAmount'}}},
								   // {$project:{itemCode:'$_id.itemCode',itemAmount:'$totalAmount'}}// itemAmount =>total amount
							   ,function (err,arr){
							   		
									codesAndAmounts = resumeCodeAndAmount(arr);

									Item.find({'companyId':query.companyId},function (err,array){

										codesAndAmountsFromStock = resumeCodeAndAmount(array);									
										negativeAmounts = checkIfNegative(subtract2arrays(codesAndAmountsFromStock,codesAndAmounts));
										var justCodesWithNegative = getJustCodes(negativeAmounts);

										Item.find({'itemCode':{$in:justCodesWithNegative}},function (err,arr){ // hay que complementar el querry con companyID
											console.log('responde con solo los items necesarios');
											res.json(remainingAmount(arr,negativeAmounts));
											// var vaina = remainingAmount(arr,negativeAmounts);
											// res.csv(vaina, "myFile.csv");

										});
				
									});


								}
							 );
	

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
								console.log('todo bien');
								res.json(array);
							   });
	   }

	


	function updateProject (req,res){ // funcion para actualizar los itenes insertados en un projecto

		var query = req.query; 
		var arrayItems = req.body;

		Project.findOneAndUpdate(query,// {companyId,projectNumber,projectAssemblies.assemblyNumber}
			{$set:{'projectAssemblies.$.assemblyItems':arrayItems}},
			{new:true},function (err,obj){
				if(err){
					res.json(err);
				}
				else{
					console.log(obj +' linea 165');
					res.json(obj);
				}
				
			});

	}


}

module.exports = handle;