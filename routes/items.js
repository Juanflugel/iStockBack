var mongoose = require('mongoose'),
	bodyParser = require('body-parser');

function items (app,Item,io){

	app.use(bodyParser.json());

	app.get('/items',getItem);
	app.get('/itemsCode',getByItemsCode);// regular expression para el front
	app.get('/findDuplicates',findDuplicates);
	app.get('/fullSearch',fullSearch);
	app.post('/items',postItemOrCollection);
	app.put('/items',updateAmountOrEveryThing);
	app.put('/increment',increment);
	app.delete('/items',deleteItem);

	function getItem (req,res){ // get items by Code, all items in collection and items with amount 0

		//console.log(req.query);
		var query = req.query;

		function findByCode () { // Find a Document by Bar Code Number
			 // query {'itemCode':code}
			Item.find(query,function (err,array){
				res.json(array);
				if (err){
					res.json(err);
				}
			});
		}

		function findAll () { // Show all the Documents in the collection
			Item.find({},function (err,array){
				res.json(array);
				if (err){
					res.json(err);
				}
			});
		}

		function findRunOut () { // Find all the documents with Amount = 0
		 // query {'itemAmount':0}       
			Item.find(query,function (err,array){
				res.json(array);
				if (err){
					res.json(err);
				}
			});
		}

		function findForAssembley(){
			// console.log(query.array)
			// console.log('array de items para');
			Item.find({'itemCode':{$in:query.array},companyId:query.companyId},function (err,array){
				console.log('responde con solo los items necesarios:'+ array.length);
				res.json(array);
			});
		}
		
		if (Object.keys(req.query).length === 0){
			findAll();
		}
		else if(query.itemCode) {
			findByCode();
		}
		else if (query.itemAmount){
			findRunOut();
		}
		else if (query.array){
			findForAssembley();
		}
		else{
			findByCode();
		}

   
	}

	// prueba de regular expressions, esto hay que mejoralo pero por ahora bien

	function getByItemsCode(req,res){
		var query = req.query;
		var stringToSearch = req.query.string;
		Item.find( { $or: [	{itemCode: new RegExp(stringToSearch,"i"),companyId:query.companyId},
							{itemName: new RegExp(stringToSearch,"i"),companyId:query.companyId} ] },
							function (err,array){
								if (err){
									res.json(err);
								}
								res.json(array);
		}).limit(30);
	}
	// prueba de regular expression

	function postItemOrCollection (req,res){
		
		function insertCollection (){ // insert a collection of Documents

			Item.create(req.body,function (err,array){
				res.json(array);               
			});       
		}

		function insertItem (){ // create just one Document in the collection

			Item.create(req.body,function (err,array){
				res.json(array);
			});          
		}

		if (Array.isArray(req.body)){
			insertCollection();
		}
		else {
			insertItem();
		}
	}

	function updateAmountOrEveryThing (req,res){ // to update just the amount or the whole Document
		var query = req.query;
		var todo = req.body;
		todo.itemLastDate = new Date();

		function updateAmount (){ // query {'itemCode':code}
			Item.findOneAndUpdate(query,{'itemAmount':todo.itemAmount,
										 'itemLastDate':todo.itemLastDate,
										 'itemLastPerson':todo.itemLastPerson
										},{new:true},function (err,obj){
												res.json(obj);
												if (err){
													res.json(err);
												}
											}
								);
		}

		function updateDocument (){ // query {'_id':mongoid}
			Item.findOneAndUpdate(query,todo,
			{new:true},function (err,obj){
				res.json(obj);
			});
		}   

		if (query.itemCode){
			updateAmount();            
		}

		else if (query._id){
		   updateDocument();
		}
	}

	function deleteItem (req,res){
		var query = req.query;
			Item.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
	}

	function findDuplicates (req,res){
		var query = req.query;
		Item.aggregate([{$match:query},
						{$group:{_id:{itemCode:'$itemCode'},total:{$sum:1}}},
						{$match:{total:{$gt:1}}},
						{$project:{_id:1,total:1}}
							],function (err,array){
			res.json(array);
		});
	}

	function increment (req,res){ // function to try to add and sustract amount from stock
		var query = req.query;
		var arrayOfObj = req.body; //[[itemCode,Amount],[]]
		var l = arrayOfObj.length;
		
		for (var i=0; i < l ; i++){
			query.itemCode = arrayOfObj[i][0];
			Item.findOneAndUpdate(query,{// companyId,itemCode
				$inc: { 'itemAmount':arrayOfObj[i][1]},'itemLastDate': new Date()
			},{new:true},function (err,obj){
				if (err){
					console.log(err);
				}
			});
		}

		res.json({answer:'everything updated'});
	}

	function fullSearch (req,res){
		var query = req.query;
		var stringToSearch =  query.string;
		console.log(query);
		Item.find( { $or: [	{itemCode: new RegExp(stringToSearch,"i"),companyId:query.companyId},
							{itemName: new RegExp(stringToSearch,"i"),companyId:query.companyId} ] },
							function (err,array){
								res.json(array);
		})
		
	}

	
}


module.exports = items;
