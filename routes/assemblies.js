var mongoose = require ('mongoose'),
bodyParser = require('body-parser');

function assemblies (app,Assembly){

	app.use(bodyParser.json());

	app.get('/monda',prueba);
	app.post('/assemblies',newAssembly);

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


}

module.exports = assemblies;