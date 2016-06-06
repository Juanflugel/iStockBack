var mongoose = require('mongoose'),
	bodyParser = require('body-parser');

function items (app,Item,io){

	app.use(bodyParser.json());

	app.get('/items',getItem);
	app.get('/itemsCode',getByItemsCode);// regular expression para el front
	app.post('/items',postItemOrCollection);
	app.put('/items',updateAmountOrEveryThing);
	app.put('/itemsMultipleAmount',updateMultipleAmount);
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
			console.log(query.array)
			console.log('todo bien mijo');
			Item.find({'itemCode':{$in:query.array},companyId:query.companyId},function (err,array){
				console.log('responde con solo los items necesarios');
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

	// prueba de regular expressions

	function getByItemsCode(req,res){
		var codeToSearch = req.query.itemCode;
		Item.find({ itemCode: new RegExp(codeToSearch,"i") },function (err,array){
			if (err){
					res.json(err);
				}
			res.json(array);
		});
	}
	// prueba de regular expression

	function postItemOrCollection (req,res){
		
		function insertCollection (){ // insert a collection of Documents
			//Item.collection.insert
			Item.create(req.body,function (err,array){
				res.json(array);               
			});            
			//io.emit('newCollection',req.body);            
		}

		function insertItem (){ // create just one Document in the collection
			// console.log(req.body);
			Item.create(req.body,function (err,array){
				res.json(array);
			});
			//then(io.emit('newItem',req.body));           
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

	function updateMultipleAmount (req,res){
		 var query = {};
		 var group = req.body;
		 var l = group.length;
		 console.log('linea 133'+l);
		 var count = 0;


		 for (i=0;i<l;i++){

		 	var item = group[i];
            query.itemCode = item[0];
            var currentAmount = item[1];

            Item.findOneAndUpdate(query,{'itemAmount':currentAmount},
            					  {new:true},function (err,obj){
												if (err) {
													res.json(err);
												} 
												count++                                                                        
												
												if (i == count){
													console.log('linea 149'+count);
													res.json(count);
												}
												
			});


		 }
	}

	function deleteItem (req,res){
		var query = req.query;
			Item.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});

	}

	
}


module.exports = items;
