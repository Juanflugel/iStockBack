var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function users (app,User){

	app.use(bodyParser.json());

	app.get('/users',getUsers);
	app.post('/users',newUser);
	app.put('/users',updateUser);
	app.delete('/users',deleteUser);

	function newUser (req,res){
		User.create(req.body,function (err,obj){
			console.log('nuevo');
			res.json(obj);
		});	
	}

	function getUsers (req,res){
		var query = req.query;
		// res.json('todo bien primo');
		function getUserById (){	
			console.log(query);
			User.find(query,function (err,array){
			res.json(array);
			});
		}

		function getCompanyUsersCollection (){			
			console.log(query);
			User.find(query,function (err,array){ // query:{companyId:'RMB01'} 
			res.json(array);
			});
		}

		if (req.query._id){
			getUserById();
		}

		if (req.query.companyId){
			getCompanyUsersCollection();
		}
		
	}

	function updateUser (req,res){
		var query = req.query;
		var todo = req.body;

		User.findOneAndUpdate(query,todo,function (err,obj){
					res.json(obj);
				});	
	}

	function deleteUser (req,res){
		var query = req.query;
			User.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});

	}


}

module.exports = users;