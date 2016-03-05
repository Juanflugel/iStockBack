var mongoose = require('mongoose'),
    bodyParser = require('body-parser');

function items (app,Item,io){

    app.use(bodyParser.json());

    app.get('/items',getItem);
    app.post('/items',postItemOrCollection);
    app.put('/items',updateAmountOrEveryThing);

    function getItem (req,res){

        console.log(req.query);

        function findByCode () { // Find a Document by Bar Code Number
            var idCode = req.query.idCode;
            Item.find({'itemCode':idCode},function (err,array){
                res.json(array);
                if (err){
                    res.json(err);
                }
            });
        }

        function findAll () { // Show all the Documents in the collection
            Item.find({},function (err,array){
                res.json(array);
            });
        }

        function findRunOut () { // Find all the documents with Amount = 0 
            var cero = req.query.cant;
            console.log(cero);
            Item.find({'itemAmount':cero},function (err,array){
                res.json(array);
            });
        }
        
        if (Object.keys(req.query).length === 0){
            findAll();
        }
        else if(req.query.idCode) {
            findByCode();
        }
        else if (req.query.cant){
            findRunOut();
        }

   
    }

    function postItemOrCollection (req,res){
        
        function insertCollection (){
            var d ;

            //Item.collection.insert
            Item.create(req.body,function (err,array){
                console.log(array);
                var fo = {};
                fo.arr = array
                res.json(fo);               
            });
            
            io.emit('newCollection',req.body);

            
        }

        function insertItem (){
            console.log(req.body);
            Item.create(req.body,function (err,array){
                res.json(array);
            }).then(io.emit('newItem',req.body));           
        }

        if (Array.isArray(req.body)){
            insertCollection();
        }
        else {
            insertItem();
        }
    }

    function stringToNumber (){ // funcion de una locura que estaba probando

        Item.find( { 'itemAmount' : { $type : 2 } } ).forEach( function (x) {   
              x.itemAmount = parseInt(x.bad); // convert string to number
              Item.save(x);
            });
    }

    function updateAmountOrEveryThing (req,res){ // to update just the amount or the whole Document
        var query = req.query;
        var todo = req.body;

        function updateAmount (){
            Item.findOneAndUpdate({'itemCode':query.idCode},{'itemAmount':todo.itemAmount},
            {new:true},function (err,obj){
                res.json(obj);
                if (err){
                    res.json(err);
                }
            });
        }

        function updateDocument (){
            Item.findOneAndUpdate({'_id':query.idDocument},todo,
            {new:true},function (err,obj){
                res.json(obj);
            });
        }   

        if (query.hasOwnProperty('idCode')){
            updateAmount();            
        }

        else if (query.hasOwnProperty('idDocument')){
           updateDocument();
        }
    }

    
}

module.exports = items;

//{'itemAmount':amount}