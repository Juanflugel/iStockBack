var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	mongoose = require('mongoose'),
	db = mongoose.connection,
	cors = require('cors'),
	port = 5006,
	// Cargo los Schemas de la API
	Bill = require('./models/app_DB_Schema_Bills.js'),
	Item = require('./models/app_DB_Schema_Items.js'),
	Company = require('./models/app_DB_Schema_Companies.js'),
	// Cargo las rutas de la AP
	bills = require('./routes/bills.js'),
	items = require('./routes/items.js'),
	companies = require('./routes/companies.js');
	

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
// route have to accept app and model
bills(app,Bill);
items(app,Item,io);
companies(app,Company);




server.listen(port,function(){
	console.log('working on Port :' + port);
});
