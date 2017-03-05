/**
 * Created by praba on 2/10/2016.
 */

var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');



var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Lodaing static files like elements from app folder
app.use(express.static('app'));

//Receiving get request from index.html to render the home page of the application
app.get('/' ,function (req, res) {
  res.sendFile( "app/index.html" );
});

global.connection=null;
app.post('/loadconnection' ,function (req, res) {
  console.log(req.query.dbname);
  console.log(req.query.dbpass);
  console.log(req.query.dbuser);
  console.log(req.query.dbport);
  console.log(req.query.dbhost);
  global.dbname=req.query.dbname;
  global.dbpass=req.query.dbpass;
  global.dbuser=req.query.dbuser;
  global.dbport=req.query.dbport;
  global.dbhost=req.query.dbhost;
  global.connection = mysql.createConnection({
  host     : req.query.dbhost,
  user     : req.query.dbuser,    /* username*/
  password : req.query.dbpass,   /* password*/
  database : req.query.dbname  /* db name*/
 });
  // console.log(connection);
 res.status(200).json({'returnval': "Connected"});
});


//Receiving post request from login card
app.post('/search', urlencodedParser, function (req, res) {
  
  var response={
  	id:req.query.searchkey
  };
  console.log(response);
  	// global.connection.query("SELECT * FROM '"+req.query.tablename+"' WHERE ?",[response],function(err,rows){
      var qur="SELECT * FROM "+req.query.tablename+" WHERE id='"+req.query.searchkey+"'";

      console.log(qur);
      global.connection.query(qur,function(err,rows){
    if(!err){  
  	if(rows.length>0)
    //Sending positive response(role name) back to the login card if it is valid user
      res.status(200).json({'returnval': rows});
    else
    //Sending error response
      res.status(200).json({'returnval': "no rows"});
    }
    else
      console.log(err);
    });
});


//Node server running port number
app.listen(4000);

