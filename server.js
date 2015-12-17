var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs=require('fs');
  
  var mysql = require('mysql');


var app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// all environments
app.set('port', process.env.PORT || 7000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {  
	app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/', function (req,res){
    var query="select * from gumball";
	mysql.connectionManager();
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log(results);
				if(!err){
			      var count,model,serial;
			      count = results[0].count_gumballs;
			      model = results[0].model_number;
			      serial = results[0].serial_number;
				res.render("index",{count:count,model:model,serial:serial});
			}else{
				res.end('An error occurred');
	            console.log(err);
			}
		}
		
		}  
	},query);
});


var pool = mysql.createPool({
	    connectionLimit : 5,
	    host     : '52.53.211.74',
	    user     : 'sneha',
	    password : 'sneha',
	    database : 'exam',
	    port	 : 3306
});

function fetchData(callback,sqlQuery,param){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.getConnection(function(err,connection){
	 if(err){
		 connection.release(); 
		 return;
	 }
	
	connection.query(sqlQuery, param,function(err, rows) {
		if(err){
			console.log("ERROR: " + err.message);
			connection.release();
			throw err;
		}
		else 
		{	// return err or result
			connection.release();
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
});
}	


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	});