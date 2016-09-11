var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	db = mongoose.connection,
	cors = require('cors'),
	port = 5006,
	// Cargo los Schemas de la API
	Bill = require('./models/app_DB_Schema_Bills.js'),
	Item = require('./models/app_DB_Schema_Items.js'),
	Company = require('./models/app_DB_Schema_Companies.js'),
	Assembly = require('./models/app_DB_Schema_Assemblies.js'),
	Project = require('./models/app_DB_Schema_Projects.js'),
	Order =  require('./models/app_DB_Schema_Orders.js'),
	// Cargo las rutas de la AP
	bills = require('./routes/bills.js'),
	items = require('./routes/items.js'),
	companies = require('./routes/companies.js'),
	assemblies = require('./routes/assemblies.js'),
	handle = require('./routes/handle.js'),
	projects = require('./routes/projects.js');
	orders = require('./routes/orders.js');
	json2csv = require('nice-json2csv');
	

mongoose.connect('mongodb://localhost/istockDB');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
		console.log('Conectado a la base de datos istockDB MOngoDB');
});

	io.on('connection', function (socket) {
  	console.log('socket funcionando');
  	// items(app,Item,io);
    });

// Configuration
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(json2csv.expressDecorator);
// route have to accept app and model,
bills(app,Bill);
items(app,Item,io);
companies(app,Company);
assemblies(app,Assembly);
handle(app,Item,Project);
projects(app,Project);
orders(app,Order);




server.listen(port,function(){
	console.log('working on Port :' + port);
});
