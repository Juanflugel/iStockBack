var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function assemblies (app,Assembly){

	app.use(bodyParser.json());

	app.get('/assemblies',prueba);
	app.post('/assemblies',newAssembly);
	app.delete('/assemblies',deleteAssembly);

	function prueba (req,res){
		Assembly.find({},function (err,array){
			res.json(array);
		});
	}

	function newAssembly (req,res) {
			console.log (req.body);
			Assembly.create(req.body,function (err,obj) {
				res.json(obj);
			});
	}

	 function deleteAssembly(req,res){
    	var query = req.query;
			Assembly.findOneAndRemove(query,function (err,obj){
				res.json(obj);
			});
    }


}

module.exports = assemblies;