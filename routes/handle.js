var mongoose = require ('mongoose');
var _=require('underscore');
var bodyParser = require('body-parser');

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

	app.get('/handleProject',totalAmounts);
	// app.post('/assemblies',newAssembly);
	// app.put('/assemblies',updateAssembly);
	// app.delete('/assemblies',deleteAssembly);

	function totalAmounts (req,res){

		var codesAndAmounts = [];
		var codesAndAmountsFromStock = [];
		var negativeAmounts = [];
		var arrayWithCodes = [];
		var query = req.query;

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
									codesAndAmounts = resumeCodeAndAmount(arr);
									// console.log('listo1',new Date());
								Item.find({},function (err,array){

									codesAndAmountsFromStock = resumeCodeAndAmount(array);
									// console.log('listo2',new Date());
									var negativeAmounts = checkIfNegative(subtract2arrays(codesAndAmountsFromStock,codesAndAmounts));
									var justCodesWithNegative = getJustCodes(negativeAmounts);

										Item.find({'itemCode':{$in:justCodesWithNegative}},function (err,arr){ // hay que complementar el querry con companyID
										console.log('responde con solo los items necesarios');
										// console.log(remainingAmount(arr,negativeAmounts));
										res.json(remainingAmount(arr,negativeAmounts));

										});
				
								});


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

module.exports = handle;