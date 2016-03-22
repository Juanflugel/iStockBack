var mongoose = require('mongoose'),
    bodyParser = require('body-parser');

    function projects (app,Project){

    	app.use(bodyParser.json());

    	app.get('/projects',getCompanyProjects);
    	app.post('/projects',newProject);
    	app.put('/projects',updateProject);
    	app.put('/itemToProject',itemToProject);

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
            item.itemAssemblyTime = new Date();
    		
	    	Project.findOneAndUpdate( query,// {projectNumber: 123455}
	    							  {$push:{projectItems:item}},
	    							  {new:true},function (error,obj){
	    							  		res.json(obj);
	    								 
                                    });
    	}

    }

module.exports = projects;